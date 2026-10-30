
function Table({ tableau }) {
    return (
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
    );
}

export default Table;