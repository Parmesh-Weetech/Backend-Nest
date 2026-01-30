export function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

export function getCurrentTimePlusSeconds(seconds: number) {
    const d = new Date(Date.now() + seconds * 1000);
    return d.toISOString().split('T')[1].slice(0, 5);
}