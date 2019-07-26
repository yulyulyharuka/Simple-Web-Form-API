import React, { Component } from 'react'
import DataTable from 'react-data-table-component';

const data = [{ id: 1, title: 'Conan the Barbarian', summary: 'Orphaned boy Conan is enslaved after his village is destroyed...',  year: '1982' }];
const columns = [
  {
    name: 'Title',
    sortable: true,
    cell: row => <div><div style={{ fontWeight: 'bold' }}>{row.title}</div>{row.summary}</div>,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
    right: true,
  },
];


class MyComponent extends Component {
  constructor(props){
    super(props)
    this.state ={
      toggledClearRows: false
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(state) {
    console.log('Selected Rows: ', this.state.selectedRows);
  }

  handleClearRows() {
    this.setState({ toggledClearRows: !this.state.toggledClearRows})
  }

  render() { 
    return (
      <DataTable
        title="Arnold Movies"
        columns={columns}
        data={data}
        selectableRows
        selectableRowsComponent={Checkbox}
        selectableRowsComponentProps={{ inkDisabled: true }}
        sortIcon={'arrow_downward'}
        onTableUpdate={handleChange}
      />
    )
  }
}

export default MyComponent