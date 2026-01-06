export const getToday = () => new Date().toISOString().split('T')[0];

export const calcHours = (i, o) => {
    if (!i || !o) return 0;
    const diff = (new Date(`2024-01-01T${o}`) - new Date(`2024-01-01T${i}`)) / 3600000;
    return diff > 0 ? diff.toFixed(2) : 0;
};