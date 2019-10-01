export const ERROR_API_ROUTE_NOT_FOUND = "API route not found"
export const ERROR_RESPONSE_INVALID_JSON = 'Invalid response Json structure'
export function FormatMoney(money) {
    if (money && !isNaN(money))
        return "$ " + money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    else
        return "$0"
}