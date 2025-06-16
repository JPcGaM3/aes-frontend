export default async function getRequestOrder(){
    const response = await fetch("http://localhost:8080/api/v1/request-order", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch orders: " + response.statusText);
    }

    const data = await response.json()

    return data;
}