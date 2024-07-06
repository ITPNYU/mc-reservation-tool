import { AttendeeAffiliation, Inputs, Role } from '../../../../types';
import {
  BookingFormAgreementCheckbox,
  BookingFormDropdown,
  BookingFormSwitch,
  BookingFormTextField,
} from './BookingFormInputs';
import { Box, Button, Typography } from '@mui/material';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { BookingContext } from '../bookingProvider';
import BookingFormMediaServices from './BookingFormMediaServices';
import BookingSelection from './BookingSelection';
import { DatabaseContext } from '../../components/Provider';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '20px' }}>
    <Typography variant="h5" style={{ marginBottom: '8px' }}>
      {title}
    </Typography>
    <div>{children}</div>
  </div>
);

export default function FormInput({ handleParentSubmit }) {
  const { userEmail, settings } = useContext(DatabaseContext);
  const { role, department, selectedRooms } = useContext(BookingContext);
  const {
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    defaultValues: {
      setupDetails: '',
      cateringService: '',
      sponsorFirstName: '',
      sponsorLastName: '',
      sponsorEmail: '',
      mediaServicesDetails: '',
      role,
      catering: 'no',
      chartFieldForCatering: '',
      chartFieldForSecurity: '',
      chartFieldForRoomSetup: '',
      hireSecurity: 'no',
      attendeeAffiliation: '',
      department,
      roomSetup: 'no',
      reservationType: '',
    },
    mode: 'onBlur',
  });

  // agreements
  const [checklist, setChecklist] = useState(false);
  const [resetRoom, setResetRoom] = useState(false);
  const [bookingPolicy, setBookingPolicy] = useState(false);

  const maxCapacity = useMemo(
    () =>
      selectedRooms.reduce((sum, room) => {
        return sum + parseInt(room.capacity);
      }, 0),
    [selectedRooms]
  );

  const validateExpectedAttendance = useCallback(
    (value: string) => {
      const attendance = parseInt(value);
      return (
        (!isNaN(attendance) && attendance <= maxCapacity) ||
        `Expected attendance exceeds maximum capacity of ${maxCapacity}`
      );
    },
    [maxCapacity]
  );

  const validateSponsorEmail = useCallback(
    (value: string) => {
      if (value === userEmail) {
        return 'Sponsor email cannot be your own email';
      }
      return true;
    },
    [userEmail]
  );

  const disabledButton = !(checklist && resetRoom && bookingPolicy && isValid);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const dumpMediaServices = data.mediaServices || [];
    data.mediaServices = Array.isArray(dumpMediaServices)
      ? dumpMediaServices.join(', ')
      : dumpMediaServices;
    handleParentSubmit(data);
  };

  return (
    <Box sx={{ padding: '32px 0px' }}>
      <BookingSelection />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* {userEmail == null && (
          <div className="mb-6">
            <label
              htmlFor="missingEmail"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <p className="text-xs">
              This section is displayed only to those who couldn't obtain an
              email
            </p>

            {errors.missingEmail && (
              <ErrorMessage errors={errors.missingEmail.message} />
            )}
            <input
              type="text"
              id="missingEmail"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[600px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
              {...register('missingEmail')}
            />
          </div>
        )} */}
        <Section title="Contact Information">
          <BookingFormTextField
            id="firstName"
            label="First Name"
            {...{ control, errors, trigger }}
          />
          <BookingFormTextField
            id="lastName"
            label="Last Name"
            {...{ control, errors, trigger }}
          />
          <BookingFormTextField
            id="secondaryName"
            label="Secondary Point of Contact"
            description="If the person submitting this request is not the Point of Contact for the reservation, please add their name and contact information here (i.e. event organizer, faculty member, etc.)"
            required={false}
            {...{ control, errors, trigger }}
          />
          <BookingFormTextField
            id="nNumber"
            label="NYU N-Number"
            description="Your N-number begins with a capital 'N' followed by eight digits."
            required
            pattern={{
              value: /N[0-9]{8}/,
              message: 'Invalid N-Number',
            }}
            {...{ control, errors, trigger }}
          />

          <BookingFormTextField
            id="netId"
            label="NYU Net ID"
            description="Your Net ID is the username portion of your official NYU email address. It begins with your initials followed by one or more numbers."
            required
            pattern={{
              value: /[a-zA-Z]{1,3}[0-9]{1,6}/,
              message: 'Invalid Net ID',
            }}
            {...{ control, errors, trigger }}
          />

          <BookingFormTextField
            id="phoneNumber"
            label="Phone Number"
            required
            pattern={{
              value:
                /^\(?([2-9][0-8][0-9])\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})$/,
              message: 'Please enter a valid 10 digit telephone number.',
            }}
            {...{ control, errors, trigger }}
          />
        </Section>

        {watch('role') === 'Student' && (
          <Section title="Sponsor">
            <BookingFormTextField
              id="sponsorFirstName"
              label="Sponsor First Name"
              required={watch('role') === Role.STUDENT}
              {...{ control, errors, trigger }}
            />

            <BookingFormTextField
              id="sponsorLastName"
              label="Sponsor Last Name"
              required={watch('role') === Role.STUDENT}
              {...{ control, errors, trigger }}
            />

            <BookingFormTextField
              id="sponsorEmail"
              label="Sponsor Email"
              description="Must be an nyu.edu email address"
              required={watch('role') === Role.STUDENT}
              pattern={{
                value: /^[A-Z0-9._%+-]+@nyu.edu$/i,
                message: 'Invalid email address',
              }}
              validate={validateSponsorEmail}
              {...{ control, errors, trigger }}
            />
          </Section>
        )}

        <Section title="Reservation Details">
          <BookingFormTextField
            id="title"
            label="Reservation Title"
            {...{ control, errors, trigger }}
          />
          <BookingFormTextField
            id="description"
            label="Reservation Description"
            {...{ control, errors, trigger }}
          />
          <BookingFormDropdown
            id="reservationType"
            label="Reservation Type"
            options={settings.reservationTypes.map((x) => x.reservationType)}
            {...{ control, errors, trigger }}
          />
          <BookingFormTextField
            id="expectedAttendance"
            label="Expected Attendance"
            validate={validateExpectedAttendance}
            {...{ control, errors, trigger }}
          />
          <BookingFormDropdown
            id="attendeeAffiliation"
            label="Attendee Affiliation(s)"
            options={Object.values(AttendeeAffiliation)}
            description={
              <p>
                Non-NYU guests will need to be sponsored through JRNY. For more
                information about visitor, vendor, and affiliate access,
                <a
                  href="https://www.nyu.edu/about/visitor-information/sponsoring-visitors.html"
                  className="text-blue-600 hover:underline dark:text-blue-500 mx-1"
                  target="_blank"
                >
                  click here
                </a>
                .
              </p>
            }
            {...{ control, errors, trigger }}
          />
        </Section>

        <Section title="Services">
          <div style={{ marginBottom: 32 }}>
            <BookingFormSwitch
              id="roomSetup"
              label="Room Setup Needed?"
              required={false}
              description={
                <p>
                  If your reservation is in 233 or 1201 and requires a specific
                  room setup that is different from the standard configuration,
                  it is the reservation holder’s responsibility to submit a
                  <a
                    className="text-blue-600 hover:underline dark:text-blue-500 mx-1"
                    href="https://nyu.service-now.com/csmp?id=sc_home"
                    target="_blank"
                  >
                    work order with CBS
                  </a>
                  . <br />
                  It is also the reservation holder's responsibility to ensure
                  the room is reset after use.
                </p>
              }
              {...{ control, errors, trigger }}
            />
            {watch('roomSetup') === 'yes' && (
              <>
                <BookingFormTextField
                  id="setupDetails"
                  label="Room Setup Details"
                  description="If you requested Room Setup and are not using rooms 233 or 1201, please explain your needs including # of chairs, # tables, and formation."
                  {...{ control, errors, trigger }}
                />
                <BookingFormTextField
                  id="chartFieldForRoomSetup"
                  label="ChartField for Room Setup"
                  {...{ control, errors, trigger }}
                />
              </>
            )}
          </div>
          <div style={{ marginBottom: 32 }}>
            <BookingFormMediaServices
              id="mediaServices"
              {...{ control, trigger }}
            />
            {watch('mediaServices') !== undefined &&
              watch('mediaServices').length > 0 && (
                <BookingFormTextField
                  id="mediaServicesDetails"
                  label="Media Services Details"
                  description={
                    <p>
                      If you selected any of the Media Services above, please
                      describe your needs in detail.
                      <br />
                      If you need to check out equipment, you can check our
                      inventory and include your request below. (Ie. 2x Small
                      Mocap Suits)
                      <br />-{' '}
                      <a
                        href="https://docs.google.com/document/d/1oRtvZ0SR52Mq_ykoNXelwqat4JFgdado5JDY6A746VY/edit#heading=h.iv9c7z15bn0t"
                        target="_blank"
                        className="text-blue-600 hover:underline dark:text-blue-500 mx-1"
                      >
                        Inventory for Black Box 220 and Ballrooms 221-224
                      </a>
                      <br />-{' '}
                      <a
                        href="https://docs.google.com/spreadsheets/d/1fziyVrzeytQJyZ8585Wtqxer-PBt6L-u-Z0LHVavK5k/edit#gid=870626522"
                        target="_blank"
                        className="text-blue-600 hover:underline dark:text-blue-500 mx-1"
                      >
                        Inventory for Garage 103
                      </a>
                      <br />
                    </p>
                  }
                  {...{ control, errors, trigger }}
                />
              )}
          </div>
          <div style={{ marginBottom: 32 }}>
            <BookingFormSwitch
              id="catering"
              label="Catering?"
              description="It is required for the reservation holder to pay and arrange for
              CBS cleaning services if the event includes catering"
              required={false}
              {...{ control, errors, trigger }}
            />
            {watch('catering') === 'yes' && (
              <>
                <BookingFormDropdown
                  id="cateringService"
                  label="Catering Information"
                  options={['Outside Catering', 'NYU Plated']}
                  {...{ control, errors, trigger }}
                />
                <BookingFormTextField
                  id="chartFieldForCatering"
                  label="ChartField for Catering"
                  {...{ control, errors, trigger }}
                />
              </>
            )}
          </div>
          <div style={{ marginBottom: 32 }}>
            <BookingFormSwitch
              id="hireSecurity"
              label="Hire Security?"
              required={false}
              description={
                <p>
                  Only for large events with 75+ attendees, and bookings in The
                  Garage where the Willoughby entrance will be in use. Once your
                  booking is confirmed, it is your responsibility to hire Campus
                  Safety for your event. If appropriate, please coordinate with
                  your departmental Scheduling Liaison to hire Campus Safety, as
                  there is a fee.
                  <a
                    href="https://www.nyu.edu/life/safety-health-wellness/campus-safety.html"
                    target="_blank"
                    className="text-blue-600 hover:underline dark:text-blue-500 mx-1"
                  >
                    Click for Campus Safety Form
                  </a>
                </p>
              }
              {...{ control, errors, trigger }}
            />
          </div>
          {watch('hireSecurity') === 'yes' && (
            <BookingFormTextField
              id="chartFieldForSecurity"
              label="ChartField for Security"
              {...{ control, errors, trigger }}
            />
          )}
        </Section>

        <Section title="Agreement">
          <BookingFormAgreementCheckbox
            id="checklist"
            checked={checklist}
            onChange={setChecklist}
            description={
              <p>
                {' '}
                I confirm receipt of the
                <a
                  href="https://docs.google.com/document/d/1TIOl8f8-7o2BdjHxHYIYELSb4oc8QZMj1aSfaENWjR8/edit?usp=sharing"
                  target="_blank"
                  className="text-blue-600 hover:underline dark:text-blue-500 mx-1 mx-1"
                >
                  370J Pre-Event Checklist
                </a>
                and acknowledge that it is my responsibility to setup various
                event services as detailed within the checklist. While the 370J
                Operations staff do setup cleaning services through CBS, they do
                not facilitate hiring security, catering, and arranging room
                setup services.
              </p>
            }
          />
          <BookingFormAgreementCheckbox
            id="resetRoom"
            checked={resetRoom}
            onChange={setResetRoom}
            description={
              <p>
                I agree to reset any and all requested rooms and common spaces
                to their original state at the end of the event, including
                cleaning and furniture return, and will notify building staff of
                any problems, damage, or other concerns affecting the condition
                and maintenance of the reserved space. I understand that if I do
                not reset the room, I will lose reservation privileges.
              </p>
            }
          />
          <BookingFormAgreementCheckbox
            id="bookingPolicy"
            checked={bookingPolicy}
            onChange={setBookingPolicy}
            description={
              <p>
                I have read the
                <a
                  href="https://docs.google.com/document/d/1vAajz6XRV0EUXaMrLivP_yDq_LyY43BvxOqlH-oNacc/edit?usp=sharing"
                  target="_blank"
                  className="text-blue-600 hover:underline dark:text-blue-500 mx-1 mx-1"
                >
                  Booking Policy for 370 Jay Street Shared Spaces
                </a>
                and agree to follow all policies outlined. I understand that I
                may lose access to spaces if I break this agreement.
              </p>
            }
          />
        </Section>
        <Button type="submit" disabled={disabledButton} variant="contained">
          Submit
        </Button>
      </form>
    </Box>
  );
}
