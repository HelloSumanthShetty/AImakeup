export interface GenerateMakeupResponse {
  image?: string;
  text?: string;
  error?: string;
}

export const generateMakeup = async (prompt: string): Promise<GenerateMakeupResponse> => {
  try {
    const response = await fetch('http://localhost:5000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling makeup API:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
};
