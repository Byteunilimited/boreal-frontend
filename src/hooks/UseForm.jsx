export const useForm = () => {
    const serialize = (form) => {
        const data = new FormData(form);
        const formData = {};
        for (let [name, value] of data) {
            formData[name] = value;
        }
        return formData;
    }
    const serializeFiles = (form) => {
        return new FormData(form)
    }
    const serializeFilesFromJson = (data) => {
        function buildFormData(formData, data, parentKey) {
            if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
                Object.keys(data).forEach(key => {
                    buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
                });
            } else {
                const value = data;
                formData.append(parentKey, value);
            }
        }
        const formData = new FormData();
        buildFormData(formData, data);
        return formData;
    }
    return {
        serialize,
        serializeFiles,
        serializeFilesFromJson
    }
}
