export const generateId = () => {
    const format = 'XXXX-XXXX-XXXX-XXXX';
    return format.replace(/[X]/g, () => {
        return Math.floor(Math.random() * 16).toString(16);
    });
}