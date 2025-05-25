export function hasMoreThanTwoDecimals(value: number): boolean {
    const decimalStr = value.toString().split('.')[1];
    return decimalStr ? decimalStr.length > 2 : false;
}

export function truncateToTwoDecimals(value: number): number {
    const str = value.toString();
    const parts = str.split('.');
    if (parts.length === 2 && parts[1].length > 2) {
        return Number(`${parts[0]}.${parts[1].slice(0, 2)}`);
    }
    return value;
}
