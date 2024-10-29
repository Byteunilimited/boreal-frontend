export const TableHead = ({ data }) => {

    return (
        <tr>
            {
                data &&
                    (() => {
                        let row = []
                        Object.keys(data).map(function(key, index) {
                            row.push(<th key={ data[key] } >{ data[key] }</th>)
                        })

                        return row;
                    })()
            }
        </tr>
    );
}
