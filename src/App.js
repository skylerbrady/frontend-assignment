import React, { useState, useEffect } from "react";
import "./App.css"; // CSS file for styles

const App = () => {
  // State to hold fetched data
  const [data, setData] = useState([]);
  // Current page state
  const [currentPage, setCurrentPage] = useState(1);
  // Loader state
  const [loading, setLoading] = useState(true);
  // Records to display per page
  const recordsPerPage = 5;

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json"
        );
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Turn off loader once data is fetched
      }
    };
    fetchData();
  }, []);

  // Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(data.length / recordsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      {/* Header Section */}
      <header className="header" role="banner" aria-label="Header">
        <a
          href="https://github.com/skylerbrady/frontend-assignment?tab=readme-ov-file"
          aria-label="Homepage"
        >
          Click here github repo
        </a>
      </header>

      {/* Main Content Section */}
      <main
        className="table-container"
        role="main"
        aria-labelledby="tableTitle"
      >
        <h1 id="tableTitle" className="title">
          Campaign Statistics
        </h1>

        {/* Loader */}
        {loading ? (
          <div className="loader-container" role="alert" aria-busy="true">
            <div className="loader" aria-hidden="true"></div>
            <p>Loading data, please wait...</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div
              className="table-wrapper"
              role="table"
              aria-label="Campaign Statistics Table"
            >
              <table className="custom-table">
                <caption className="sr-only">Campaign Statistics Table</caption>
                <thead>
                  <tr>
                    <th scope="col">S.No.</th>
                    <th scope="col">Percentage Funded</th>
                    <th scope="col">Amount Pledged</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((record, index) => (
                    <tr key={index}>
                      <td data-label="S.No.">{record["s.no"]}</td>
                      <td data-label="Percentage Funded">
                        {record["percentage.funded"]}%
                      </td>
                      <td data-label="Amount Pledged">
                        ${record["amt.pledged"].toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <nav
              className="pagination"
              role="navigation"
              aria-label="Pagination Navigation"
            >
              <button
                className={`pagination-btn prev ${
                  currentPage === 1 ? "disabled" : ""
                }`}
                onClick={handlePrevious}
                disabled={currentPage === 1}
                aria-label="Previous Page"
              >
                Previous
              </button>
              <span className="pagination-text">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className={`pagination-btn next ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
                onClick={handleNext}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
              >
                Next
              </button>
            </nav>
          </>
        )}
      </main>

      {/* Footer Section */}
      <footer className="footer" role="contentinfo" aria-label="Footer">
        <p>React assignment</p>
      </footer>
    </div>
  );
};

export default App;
