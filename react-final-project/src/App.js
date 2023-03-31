import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBTable, MDBTableHead, MDBTableBody, MDBRow, MDBCol, MDBContainer, MDBBtn, MDBBtnGroup
} from 'mdb-react-ui-kit';
import ReactPaginate from 'react-paginate';

function App() {

  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [pageCount, setPageCount] = useState(0);
  let limit = 10;
  let currentPage;

  const sortOptions = ["name", "cp", "attack", "defence", "type", "status"];

  //load pokemon data
  const loadPokemonsData = async () => {
    const res = await fetch(`http://localhost:5000/pokemons?_page=1&_limit=${limit}`);
      const data = await res.json();
      const total = res.headers.get('x-total-count');
      setPageCount(Math.ceil(total/limit));
      setData(data);
  };
  console.log("data", data);

  useEffect(() => {
    loadPokemonsData();
  }, []);

  //fetch pokemon data for pagination
const fetchPokemonsData = async (currentPage) => {
  const res = await fetch(`http://localhost:5000/pokemons?_page=${currentPage}&_limit=${limit}`);
  const data = await res.json();
  return data;
}

  //handle reset
  const handleReset = () => {
    loadPokemonsData();
  };

  //handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    return await axios.get(`http://localhost:5000/pokemons?q=${value}`)
      .then((response) => {
        setData(response.data);
        setValue("");
      })
      .catch((err) => console.log(err));
  };

  //handle sort
  const handleSort = async (e) => {
    let value = e.target.value;
    setSortValue(value);
    return await axios.get(`http://localhost:5000/pokemons?_sort=${value}&_order=asc`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log(err));
  };

  //handle filter
  const handleFilter = async (value) => {
    return await axios.get(`http://localhost:5000/pokemons?status=${value}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log(err));
  };

//handle pagination
  const handlePageClick = async (data) => {
    console.log(data.selected)
    currentPage = data.selected + 1;
    const paginatePokemonsList = await fetchPokemonsData(currentPage);
    setData(paginatePokemonsList);
};

  return (
    <MDBContainer>
      <form style={{
        margin: "auto",
        padding: "15px",
        maxWidth: "400px",
        alignContent: "center"
      }}
        className="d-flex input-group w-auto"
        onSubmit={handleSearch}
      >
        <input type="text"
          className="form-control"
          placeholder="Search"
          value={value}
          onChange={(e) => setValue(e.target.value)} />
        <MDBBtn type="submit" color="dark">Search</MDBBtn>
        <MDBBtn className="mx-2" color="info" onClick={() => handleReset()}>Reset</MDBBtn>
      </form>
      <div style={{ marginTop: "30px" }}>
        <h2 className="text-center" style={{ color: "blue" }}>Pokemon Search App</h2>
        <MDBRow>
          <MDBCol size="12">
            <MDBTable>
              <MDBTableHead dark>
                <tr>
                  <th scope="col">Id No</th>
                  <th scope="col">Name</th>
                  <th scope="col">Image</th>
                  <th scope="col">CP</th>
                  <th scope="col">Attack</th>
                  <th scope="col">Defence</th>
                  <th scope="col">Type</th>
                  <th scope="col">Status</th>
                </tr>
              </MDBTableHead>
              {data.length === 0 ? (
                <MDBTableBody className="align-center md-0">
                  <tr>
                    <td colSpan={8} className="text-center md-0">No Data Found!!!</td>
                  </tr>
                </MDBTableBody>
              ) : (
                data.map((item, index) => (
                  <MDBTableBody key={index}>
                    <tr>
                      <th scope="row">{item.id}</th>
                      <th>{item.name}</th>
                      <th><img src={item.image} width={50} height={50} alt="pokemonImages" /> </th>
                      <th>{item.cp}</th>
                      <th>{item.attack}</th>
                      <th>{item.defence}</th>
                      <th>{item.type}</th>
                      <th>{item.status}</th>
                    </tr>
                  </MDBTableBody>
                ))
              )}
            </MDBTable>
          </MDBCol>
        </MDBRow>
      </div>
      <ReactPaginate  previousLabel={'Prev'}
                        nextLabel={'Next'}
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination justify-content-center'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                        previousClassName={'page-item'}
                        previousLinkClassName={'page-link'}
                        nextClassName={'page-item'}
                        nextLinkClassName={'page-link'}
                        activeClassName={'active'}
                        />
      <MDBRow>
        <MDBCol size="8">
          <h4>Sort by:</h4>
          <select style={{ width: "50%", borderRadius: "2px", height: "35px" }}
            onChange={handleSort}
            value={sortValue}>
            <option>Please Select Value</option>
            {sortOptions.map((item, index) => (
              <option value={item} key={index}>{item}</option>
            ))}
          </select>
        </MDBCol>
        <MDBCol size="4" style={{ marginBottom: "5px" }}><h4>Filter by Status:</h4>
          <MDBBtnGroup>
            <MDBBtn color="success" onClick={() => handleFilter("Active")}>Active</MDBBtn>
            <MDBBtn color="danger" style={{ marginLeft: "2px" }} onClick={() => handleFilter("Inactive")}>Inactive</MDBBtn>
          </MDBBtnGroup>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default App;
