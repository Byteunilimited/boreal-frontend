export const TableBody = ({ data }) => {

    return (
        <>
            {
                data &&
                    (() => {
                        return (Object.keys(data)).map(item => {
                            return (
                                <tr key={ item }>
                                    {
                                        (() => {
                                            let row = []

                                            Object.keys(data[item]).map(function(key, index) {
                                                row.push(<td data-label={key} key={ key }>{ (data[item])[Object.keys(data[item])[index]] }</td>);
                                            })

                                            return row;
                                        }
                                        )()
                                    }
                                </tr>
                            )
                        })
                    })()
            }       
        </>
    );
}
