package main

import (
	"database/sql"
	"fmt"
	"html/template"
	"net/http"
	"encoding/json"
	_ "github.com/lib/pq"
	"github.com/mediocregopher/radix.v2/redis"
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

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
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
	// connect to redis
	conn, err := redis.Dial("tcp", "localhost:6379")
	checkErr(err)
	defer conn.Close()

	user, err := conn.Cmd("HGET", "user:3", "name").Str()
	checkErr(err)

	fmt.Fprintf(w, "user : %s", user)
}

// return the form page 
func registrasi(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		var tmpl = template.Must(template.New("form").ParseFiles("view.html"))
		var err = tmpl.Execute(w, nil)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	http.Error(w, "", http.StatusBadRequest)
}

// to process the data from form
func processForm(w http.ResponseWriter, r *http.Request) {
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
		// var tmpl = template.Must(template.New("result").ParseFiles("view.html"))
		// if err := r.ParseForm(); err != nil {
		// 	http.Error(w, err.Error(), http.StatusInternalServerError)
		// 	return
		// }

		decoder := json.NewDecoder(r.Body)
		var user User
		err := decoder.Decode(&user)
		checkErr(err)
		fmt.Println(user.Username)
		// var name = r.FormValue("username")
		// var password = r.FormValue("password")
		// var email = r.FormValue("email")

		// inserting data to dictionary
		// data := map[string]string{"username" : name, "password" : password, "email" : email}
		// fmt.Println(data)

		// Encode the data to JSON
		// user := User{ name, password, email}
		// b, err := json.Marshal(user)
		// checkErr(err)
		// os.Stdout.Write(b)

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

		// if err := tmpl.Execute(w, data); err != nil {
		// 	http.Error(w, err.Error(), http.StatusInternalServerError)
		// }
		return
	}
	http.Error(w, "", http.StatusBadRequest)

}

func main() {
	http.HandleFunc("/world", handler)
	http.HandleFunc("/showEmployee", showEmployee)
	http.HandleFunc("/showUser", showUser)
	http.HandleFunc("/registrasi", registrasi)
	http.HandleFunc("/submit", processForm)
	http.ListenAndServe(":3000", nil)
}
