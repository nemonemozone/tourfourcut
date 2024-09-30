export const convertURLtoBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = () => {
            reject(new Error('Error converting blob to base64'));
        };
        reader.readAsDataURL(blob);
        console.log(reader.readAsDataURL(blob));
    });
};