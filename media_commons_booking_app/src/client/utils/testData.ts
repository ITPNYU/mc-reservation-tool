import { Options } from 'yargs';
import { addFakeBookingData } from './fakeBookingData';
import axios from 'axios';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

const SERVER_URL = 'http://localhost:3001/bookings';

const args = process.argv.slice(2);
const n = parseInt(args[0], 10);

if (isNaN(n)) {
  console.error('Specify how many fake bookings to generate');
  process.exit(1);
}

let fakeData = {};

const options: Record<string, Options> = {
  calendarEventId: { type: 'string' },
  roomId: { type: 'string' },
  email: { type: 'string' },
  startDate: { type: 'string' },
  endDate: { type: 'string' },
  firstName: { type: 'string' },
  lastName: { type: 'string' },
  secondaryName: { type: 'string' },
  nNumber: { type: 'string' },
  netId: { type: 'string' },
  phoneNumber: { type: 'string' },
  department: { type: 'string' },
  role: { type: 'string' },
  sponsorFirstName: { type: 'string' },
  sponsorLastName: { type: 'string' },
  sponsorEmail: { type: 'string' },
  title: { type: 'string' },
  description: { type: 'string' },
  reservationType: { type: 'string' },
  expectedAttendance: { type: 'string' },
  attendeeAffiliation: { type: 'string' },
  roomSetup: { type: 'string' },
  setupDetails: { type: 'string' },
  mediaServices: { type: 'string' },
  mediaServicesDetails: { type: 'string' },
  catering: { type: 'string' },
  cateringService: { type: 'string' },
  hireSecurity: { type: 'string' },
  chartFieldForCatering: { type: 'string' },
  chartFieldForSecurity: { type: 'string' },
  chartFieldForRoomSetup: { type: 'string' },
  devBranch: { type: 'string' },
};

const argv = yargs(hideBin(process.argv))
  .options(options)
  .parserConfiguration({ 'camel-case-expansion': false }).argv;

Object.keys(argv).forEach((key) => {
  if (key !== '_' && key !== '$0' && argv[key] !== undefined) {
    fakeData[key] = argv[key];
  }
});

const data = addFakeBookingData(n, fakeData);
axios
  .post(SERVER_URL, data)
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));

// Usage:
// npx tsx testData [number]
