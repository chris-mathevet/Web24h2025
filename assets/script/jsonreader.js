export default async function jsonreader(json) {
  const response = await fetch(json);
  if (!response.ok) throw new Error("Erreur HTTP : " + response.status);
  const data = await response.json();
  return data;
}