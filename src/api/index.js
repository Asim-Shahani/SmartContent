import * as mock from './mock'
import * as real from './real'

const USE_MOCK = true // change to false when the FastAPI backend is ready
export const api = USE_MOCK ? mock : real