import type { TerevitaLandingConfig, TerevitaLeadPayload } from './terevita-types';

const apiBaseUrl = process.env.NEXT_PUBLIC_TEREVITA_API_BASE_URL || 'http://localhost:8080/api';

export async function getTerevitaLandingConfig(slug: string): Promise<TerevitaLandingConfig> {
  const response = await fetch(`${apiBaseUrl}/landing-pages/${slug}/config`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar a configuracao da landing.');
  }

  const payload = await response.json();
  return payload.landing as TerevitaLandingConfig;
}

export async function submitTerevitaLead(slug: string, payload: TerevitaLeadPayload) {
  const response = await fetch(`${apiBaseUrl}/landing-pages/${slug}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || 'Nao foi possivel enviar o formulario.';
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  return data;
}
