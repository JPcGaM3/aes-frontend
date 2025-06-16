export default async function getRequestOrder() {
    const apiUrl = process.env.API_URL || "http://localhost:8080/api/v1";
    const response = await fetch(`${apiUrl}/request-orders`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch orders: " + response.statusText);
    }

    const data = await response.json();

    return data;
}