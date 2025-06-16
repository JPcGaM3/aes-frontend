export default async function LoginUser(username: string, password: string) {
    const apiUrl = process.env.API_URL;
    console.log("API URL:", apiUrl);

    const response = await fetch(`${apiUrl}/auth`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            // password
        })
    });

    if (!response.ok) {
        throw new Error("Failed to fetch orders: " + response.statusText);
    }

    const data = await response.json();
    console.log(data);

    return data;
}