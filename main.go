package main

import (
	"database/sql"
	"fmt"
	"os"
	"io"
	"net/http"
	"encoding/json"
	"encoding/csv"
	pq "github.com/lib/pq"
	"github.com/mediocregopher/radix.v2/redis"
	iconv "github.com/djimenez/iconv-go"
	// "golang.org/x/net/html/charset"
	// "golang.org/x/text/encoding"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "password"
	dbname   = "customer"
)

type User struct{
	Username string
	Password string
	Email string
}

type Response struct{
	Status string
}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
}

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello %s\n", r.URL.Path[1:])
}

func showEmployee(w http.ResponseWriter, r *http.Request) {
	// connect to postgres database
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	db, err := sql.Open("postgres", psqlInfo)
	checkErr(err)
	defer db.Close()

	err = db.Ping()
	checkErr(err)

	fmt.Println("Successfully connected!")

	fmt.Println("Get employee data")
	rows, err := db.Query("SELECT username FROM cust_data")
	checkErr(err)

	for rows.Next() {
		var name string
		err = rows.Scan(&name)
		checkErr(err)
		fmt.Fprintf(w, "name : %v\n", name)
	}
}

func showUser(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET"{
		name, ok := r.URL.Query()["username"]
		if !ok || len(name[0]) < 1 {
			fmt.Println("Url Param 'username' is missing")
			return
		}

		// connect to redis
		conn, err := redis.Dial("tcp", "localhost:6379")
		checkErr(err)
		defer conn.Close()

		user, err := conn.Cmd("HGET", name, "username").Str()
		checkErr(err)

		pass, err := conn.Cmd("HGET", name, "password").Str()
		checkErr(err)

		email, err := conn.Cmd("HGET", name, "email").Str()
		checkErr(err)

		u := User{user, pass, email}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(200)
		json.NewEncoder(w).Encode(u)
	}
}

// to process the data from form
func processForm(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	// connect to postgres database
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	db, err := sql.Open("postgres", psqlInfo)
	checkErr(err)
	defer db.Close()

	err = db.Ping()
	checkErr(err)

	//connect to redis
	conn, err := redis.Dial("tcp", "localhost:6379")
	checkErr(err)
	defer conn.Close()

	if r.Method == "POST" {
		decoder := json.NewDecoder(r.Body)
		var user User
		err := decoder.Decode(&user)
		checkErr(err)
		fmt.Println(user.Username)

		// inserting data to postgres
		query := `INSERT INTO cust_data(username, password, email) 
                    VALUES ($1, $2, $3)`
		_, err = db.Exec(query, user.Username, user.Password, user.Email)
		checkErr(err)

		// inserting data to redis
		input := conn.Cmd("HMSET", user.Username, "username", user.Username, "password", user.Password, "email", user.Email)
		if input.Err != nil {
			panic(input.Err)
		}

		w.Header().Set("Content-Type", "application/json")


		// create json response 
		res := &Response{
			Status: "Succesfully Registered",
		}
		response, err := json.Marshal(res)
		if err != nil {
			checkErr(err)
		}
		w.Write(response)
		return
	}
	http.Error(w, "Can not access", http.StatusBadRequest)
}


// uploadFile used to read and parse the csv file 
func uploadFile(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	if r.Method != "POST" {
        http.Error(w, "", http.StatusBadRequest)
        return
	}

	if err := r.ParseMultipartForm(32 << 20); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	file, handler, err := r.FormFile("file")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer file.Close()

	// fileHeader := make([]byte, 512)
	// if _, err := file.Read(fileHeader); err != nil {
	// 	fmt.Println(err)
	// 	return
	// }
	// contentType := http.DetectContentType(fileHeader)
	// fmt.Println(contentType)
	
	// fmt.Println(http.DetectContentType(fileHeader))
	// fileType := http.DetectContentType(fileHeader)
	// if fileType != "text/csv" {
	// 	http.Error(w, "INVALID FILE TYPE", http.StatusInternalServerError)
	// }

	// prepare db for bulk import
	// connect to postgres database
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	db, err := sql.Open("postgres", psqlInfo)
	checkErr(err)
	defer db.Close()

	err = db.Ping()
	checkErr(err)

	record := csv.NewReader(file)
	
	var datas [][]string
	// Read the csv data per record
	for {
		line, err := record.Read()
		if err == io.EOF {
			break
		}

		if err != nil {
			fmt.Println(err)
			return
		}
		
		fmt.Println(line)
		var data []string
		for _, value := range line {
			output,_ := iconv.ConvertString(value, "ASCII", "utf-8")
			data = append(data,output)
		}

		datas = append(datas, data)
	}

	txn, err := db.Begin()
	if err != nil {
		fmt.Println(err)
		return
	}

	stmt, err := txn.Prepare(pq.CopyIn("product", "id", "product_name", "supplier_name", "amount", "quality", "price", "available", "location", "category", "rating"))
	if err != nil {
		fmt.Println(err)
		return
	}

	for _, d := range datas {
		_, err = stmt.Exec(d[0], d[1], d[2], d[3], d[4], d[5], d[6], d[7], d[8], d[9])
		if err != nil {
			fmt.Println(err)
			return
		}
	}

	_, err = stmt.Exec()
	if err != nil {
		fmt.Println(err)
		return
	}

	err = stmt.Close()
	if err != nil {
		fmt.Println(err)
		return
	}

	err = txn.Commit()
	if err != nil {
		fmt.Println(err)
		return
	}

	// Copy uploaded file to local directory
	path := "Uploaded/" + handler.Filename
	_, err = os.Stat(path)

	if !os.IsNotExist(err){
		var err = os.Remove(path)
		if err != nil { 
			fmt.Println(err)
			return 
		}
	}

	f, err := os.Create(path)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer f.Close()

	writer := csv.NewWriter(f)
	defer writer.Flush()
	
	for _,value := range datas {
		err := writer.Write(value)
		if err != nil {
			fmt.Println(err)
			return
		}
	}

	// create json response 
	res := &Response{
		Status: "200",
	}
	response, err := json.Marshal(res)
	if err != nil {
		checkErr(err)
	}
	w.Write(response)

	return
}

func main() {
	http.HandleFunc("/world", handler)
	http.HandleFunc("/showEmployee", showEmployee)
	http.HandleFunc("/showUser", showUser)
	http.HandleFunc("/submit", processForm)
	http.HandleFunc("/uploadFile", uploadFile)

	fmt.Println("Serving at port :4000")
	http.ListenAndServe(":4000", nil)
}
