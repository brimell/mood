import { api_route } from "@/utils/vars";

export async function OuraConnect() {
  // Construct the authorization URL for Oura's OAuth2 flow
  const clientId = 'H6PFTDZMALWQSXSY';

  // const redirectUri = encodeURIComponent('https://mente.web.app/app/settings');
  const redirectUri = encodeURIComponent('https://localhost:3000/app/settings');

  const scope = encodeURIComponent('personal daily sleep activity readiness');

  const state = generateState();
  const responseType = 'code';

  const ouraAuthUrl = `https://cloud.ouraring.com/oauth/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

  // Redirect user to Oura's authorization page
  window.location.href = ouraAuthUrl;
}

function generateState(): string {
  return [...Array(30)].map(() => Math.random().toString(36)[2]).join('');
}

export async function getSleepData(ouraAccessToken: string, start: string, end: string) {
  try {
    const response = await fetch(`${api_route}/integrations/oura/sleep-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ouraAccessToken, start, end }),
    });
    const data = await response.json();
    console.log(data); // Process your data here
    return data;
  } catch (error) {
    return console.error('Error:', error);
  }
}