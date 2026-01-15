import axios from 'axios';

const API_USER = process.env.SIGHTENGINE_USER;
const API_SECRET = process.env.SIGHTENGINE_SECRET;

export async function verificaImagemSegura(url: string) {
  const response = await axios.get('https://api.sightengine.com/1.0/check.json', {
    params: {
      url,
      models: 'nudity-2.1,weapon,recreational_drug,medical,offensive-2.0,faces,face-age,gore-2.0,text,qr-content,tobacco,violence,self-harm,money,gambling',
      api_user: API_USER,
      api_secret: API_SECRET,
    },
  });

  const result = response.data;

  // Critérios básicos de bloqueio (ajuste conforme sua necessidade)
  const improprio =
    (result.nudity && (result.nudity.raw > 0.5 || result.nudity.partial > 0.5)) ||
    (result.weapon && result.weapon > 0.5) ||
    (result.recreational_drug && result.recreational_drug > 0.5) ||
    (result.gore && result.gore.prob > 0.5) ||
    (result.offensive && result.offensive.prob > 0.5) ||
    (result.violence && result.violence.prob > 0.5);

  return !improprio;
}