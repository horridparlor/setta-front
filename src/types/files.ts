export const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            const result = fileReader.result;
            resolve(result ? result.toString().split(',')[1] : '');
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};