
function Table({ tableau, basicSol }) {
    return (
    <div class="table">
    <table>
        <tbody>
          {
            tableau.map((row, i) => (
              <tr key={i}>
                {row.map((value, j) => (
                  <td key={j}>{value}</td>
                ))}                
              </tr>
            ))
          }
        </tbody>
      </table>
      <hr></hr>
      <table>
        <tbody>
        <tr>
          {
          basicSol.columnNames.map((col, i) => (
            <th key={i}>{col}</th>
          ))
          }
        </tr>
        
        <tr>
          {
            basicSol.values.map((value, i) => (
                <td key={i}>{value}</td>           
            ))
          }
        </tr>
        </tbody>
      </table>
      </div> 
    );
}

export default Table;