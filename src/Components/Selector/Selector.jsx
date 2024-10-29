export const Selector = ({ props }) => {
    const label = props?.label || 'Select';
    const data = props?.data || [{id:-1, description:'NONE'}];
    const action = props?.action || function(){};
    
    const handleSelectChange = e => action(e);

    return (
        <>
            <label>
                {label}
            </label>
            <select onChange={handleSelectChange} defaultValue={'DEFAULT'} >
                {
                    (() => {
                        let options = [];
                        Object.keys(data).map(function(key, index) {
                            options.push(
                                <option 
                                    key={data[key].id}
                                    value={data[key].description}
                                >
                                    { data[key].description }
                                </option>
                            )
                        })
                        return options;
                    }
                    )()
                }
            </select>
        </>
    );
}
