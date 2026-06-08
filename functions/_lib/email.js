// functions/_lib/email.js
export async function sendEmail({ to, subject, html, from }, resendKey) {
  const sender = from ?? 'Vis-à-Vision <noreply@vis-a-vision.at>'
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: sender, to, subject, html }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Resend ${res.status}: ${err}`)
  }
  return res.json()
}
