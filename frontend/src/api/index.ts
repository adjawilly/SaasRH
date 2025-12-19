// Point d'entrée unique pour les appels API
// Utilise les mocks si USE_MOCK_API est true, sinon utilise axios réel
import { USE_MOCK_API } from './config'
import mockApi from './mockApi'
import axios from 'axios'

// Exporte soit mockApi soit axios selon la configuration
const api = USE_MOCK_API ? mockApi : axios

export default api

