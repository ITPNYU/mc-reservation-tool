import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm, SubmitHandler } from 'react-hook-form';
export type Inputs = {
  firstName: string;
  lastName: string;
  secondaryName: string;
  nNumber: string;
  netId: string;
  phoneNumber: string;
  department: String;
  role: string;
  sponsorFirstName: string;
  sponsorLastName: string;
  sponsorEmail: string;
  reservationTitle: string;
  reservationDescription: string;
  attendeeAffiliation: string;
  roomSetup: string;
  setupDetails: string;
  mediaServices: string;
  mediaServicesDetails: string;
  catering: string;
  hireSecurity: string;
  expectedAttendance: string;
  chartfieldInformation: string;
  cateringService: string;
  missingEmail?: string;
};

const ErrorMessage = (message) => {
  console.log('message', message);
  return (
    <p className="mt-2 text-xs text-red-600 dark:text-red-500">
      {message.errors && message.errors !== ''
        ? message.errors
        : 'This field is required'}
    </p>
  );
};

const FormInput = ({ hasEmail, roomNumber, handleParentSubmit }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      setupDetails: '',
      cateringService: '',
      chartfieldInformation: '',
      sponsorFirstName: '',
      sponsorLastName: '',
      sponsorEmail: '',
      mediaServicesDetails: '',
      role: '',
      catering: '',
      hireSecurity: '',
      attendeeAffiliation: '',
      roomSetup: '',
    },
  });
  const [checklist, setChecklist] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const [resetRoom, setResetRoom] = useState(false);
  const [bookingPolicy, setBookingPolicy] = useState(false);
  const disabledButton = !(
    checklist &&
    agreement &&
    resetRoom &&
    bookingPolicy
  );

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const dumpMediaServices = data.mediaServices || [];
    //@ts-ignore
    data.mediaServices = dumpMediaServices?.join(', ');
    handleParentSubmit(data);
  };
  console.log('errors', errors);

  return (
    <form
      className="p-10 w-full mx-auto items-center"
      //onSubmit={(e) => {
      //  e.preventDefault();
      //  const values = Object.values(data);
      //  handleParentSubmit(values, data);
      //}}
      onSubmit={handleSubmit(onSubmit)}
    >
      {!hasEmail && (
        <div className="mb-6">
          <label
            htmlFor="missingEmail"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <p className="text-xs">
            This section is displayed only to those who couldn't obtain an email
          </p>

          {errors.missingEmail && (
            <ErrorMessage errors={errors.missingEmail.message} />
          )}
          <input
            type="text"
            id="missingEmail"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=""
            {...register('missingEmail')}
          />
        </div>
      )}
      <div className="mb-6">
        <label
          htmlFor="firstName"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          First Name
        </label>
        {errors.firstName && <ErrorMessage errors={errors.firstName.message} />}
        <input
          type="firstName"
          id="firstName"
          name="firstName"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder=""
          {...register('firstName', { required: true })}
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="lastName"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Last Name
        </label>
        {errors.lastName && <ErrorMessage errors={errors.lastName.message} />}
        <input
          type="lastName"
          id="lastName"
          name="lastName"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder=""
          {...register('lastName', { required: true })}
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="secondaryName"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Secondary Point of Contact
        </label>
        <p className="text-xs">
          If the person submitting this request is not the Point of Contact for
          the reservation, please add their name and contact information here
          (Ie Event organizer, faculty member, etc)
        </p>
        {errors.secondaryName && (
          <ErrorMessage errors={errors.secondaryName.message} />
        )}
        <input
          type="secondaryName"
          id="secondaryName"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder=""
          {...register('secondaryName')}
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="nNumber"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          NYU N-number
        </label>
        <p className="text-xs">
          Your N-number begins with a capital 'N' followed by eight digits.
        </p>
        {errors.nNumber && <ErrorMessage errors={errors.nNumber.message} />}
        <input
          type="nNumber"
          id="nNumber"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder=""
          {...register('nNumber', {
            required: true,
            pattern: {
              value: /N[0-9]{8}/,
              message:
                "Your N-number begins with a capital 'N' followed by eight digits.",
            },
          })}
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="netId"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          NYU Net ID
        </label>
        <p className="text-xs">
          Your Net ID is the username portion of your official NYU email
          address. It begins with your initials followed by one or more numbers.
        </p>
        {errors.netId && <ErrorMessage errors={errors.netId.message} />}
        <input
          type="netId"
          id="netId"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder=""
          {...register('netId', {
            required: true,
            pattern: {
              value: /[a-zA-Z]{1,3}[0-9]{1,6}/,
              message: 'Invalid Net ID',
            },
          })}
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="phoneNumber"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Phone Number
        </label>
        {errors.phoneNumber && (
          <ErrorMessage errors={errors.phoneNumber.message} />
        )}
        <input
          type="phoneNumber"
          id="phoneNumber"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder=""
          {...register('phoneNumber', {
            required: true,
            pattern: {
              value:
                /^\(?([2-9][0-8][0-9])\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})$/,
              message: 'Please enter a valid 10 digit telephone number.',
            },
          })}
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="department"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Department
        </label>
        {errors.department && (
          <ErrorMessage errors={errors.department.message} />
        )}
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register('department', { required: true })}
        >
          <option value="ALT">ALT</option>
          <option value="GameCenter">Game Center</option>
          <option value="IDM">IDM</option>
          <option value="ITP / IMA / Low Res">ITP / IMA / Low Res</option>
          <option value="MARL">MARL</option>
          <option value="Music Tech">Music Tech</option>
          <option value="Recorded Music">Recorded Music</option>
          <option value="others">Other Group</option>
        </select>
        {watch('department') === 'others' && (
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register('department')}
          />
        )}
      </div>
      <div className="mb-6">
        <label
          htmlFor="role"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Requestor's Role
        </label>
        {errors.role && <ErrorMessage errors={errors.role.message} />}
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register('role', {
            required: true,
            validate: (value) => value !== '',
          })}
        >
          <option value="" disabled>
            Select option
          </option>
          <option value="Student">Student</option>
          <option value="Resident/Fellow">Resident / Fellow</option>
          <option value="Faculty">Faculty</option>
          <option value="Admin/Staff">Admin / Staff</option>
        </select>
      </div>
      {watch('role') === 'Student' && (
        <div>
          <div className="mb-6">
            <label
              htmlFor="sponsorFirstName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Sponsor First Name
            </label>
            {errors.sponsorFirstName && (
              <ErrorMessage errors={errors.sponsorFirstName.message} />
            )}
            <input
              type="sponsorFirstName"
              id="sponsorFirstName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
              {...register('sponsorFirstName')}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="sponsorLastName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Sponsor Last Name
            </label>
            <input
              type="sponsorLastName"
              id="sponsorLastName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
              {...register('sponsorLastName')}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="sponsorEmail"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Sponsor Email
            </label>
            <p className="text-xs">Must be an nyu.edu email address</p>
            {errors.sponsorEmail && (
              <ErrorMessage errors={errors.sponsorEmail.message} />
            )}
            <input
              type="sponsorEmail"
              id="sponsorEmail"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
              {...register('sponsorEmail', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
          </div>
        </div>
      )}
      <div className="mb-6">
        <label
          htmlFor="reservationTitle"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Reservation Title
        </label>
        {errors.reservationTitle && (
          <ErrorMessage errors={errors.reservationTitle.message} />
        )}
        <input
          type="reservationTitle"
          id="reservationTitle"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder=""
          {...register('reservationTitle', { required: true })}
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="reservationDescription"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Reservation Description
        </label>
        {errors.reservationDescription && (
          <ErrorMessage errors={errors.reservationDescription.message} />
        )}
        <input
          type="reservationDescription"
          id="reservationDescription"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder=""
          {...register('reservationDescription', { required: true })}
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="expectedAttendance"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Expected Attendance
        </label>
        <p className="text-xs"></p>
        {errors.expectedAttendance && (
          <ErrorMessage errors={errors.expectedAttendance.message} />
        )}
        <input
          type="expectedAttendance"
          id="expectedAttendance"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="5"
          {...register('expectedAttendance', { required: true })}
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="attendeeAffiliation"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Attendee Affiliation(s)
        </label>
        <p className="text-xs">
          Due to COVID policies, Non-NYU members will need to gain access
          clearance through certain NYU processes. For more information about
          visitor, vendor, and affiliate access,{' '}
          <a
            href="https://www.nyu.edu/life/safety-health-wellness/coronavirus-information/campus-visitors.html"
            className="text-blue-600 hover:underline dark:text-blue-500 mx-1"
            target="_blank"
          >
            click here
          </a>
          .
        </p>
        {errors.attendeeAffiliation && (
          <ErrorMessage errors={errors.attendeeAffiliation.message} />
        )}
        <div className="flex items-center mb-4">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register('attendeeAffiliation', {
              required: true,
              validate: (value) => value !== '',
            })}
          >
            <option value="" disabled>
              Select option
            </option>
            <option value="NYU Members">
              NYU Members with an Active NYU ID
            </option>
            <option value="Non-NYU Guests">Non-NYU Guests</option>
            <option value="All of the above"> All of the above</option>
          </select>
        </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="roomSetup"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Room setup needed?
        </label>
        <p className="text-xs">
          If your event or reservation is in 233 or 1201 and requires a specific
          room setup that is different from the standard configuration, it is
          your responsibility to{' '}
          <a
            href="https://nyu.service-now.com/csmp?id=sc_cat_item&sys_id=c78a46241bb234901416ea02b24bcb26&referrer=popular_items"
            target="_blank"
          >
            submit a work order with CBS
          </a>
          . It is also the reservation holder's responsibility to ensure the
          room is reset after use. Failure to do either will result in the
          restriction of reservation privileges.
        </p>
        {errors.roomSetup && <ErrorMessage errors={errors.roomSetup.message} />}
        <div className="flex items-center mb-4">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register('roomSetup', {
              required: true,
              validate: (value) => value !== '',
            })}
          >
            <option value="" disabled>
              Select option
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>
      {watch('roomSetup') === 'yes' && (
        <div className="mb-6">
          <label
            htmlFor="setupDetails"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            If you chose "Yes" to Room Setup and are not using 233 or 1201,
            please explain your needs including # of chairs, # tables, and
            formation.
          </label>
          <p className="text-xs"></p>
          <input
            type="textarea"
            id="setupDetails"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=""
            {...register('setupDetails')}
          />
        </div>
      )}
      <div className="mb-6">
        <label
          htmlFor="mediaServices"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Media Services
        </label>
        <p className="text-xs"></p>
        {errors.mediaServices && (
          <ErrorMessage errors={errors.mediaServices.message} />
        )}
        <div className="flex flex-col mb-4">
          <label key={'technicalTraining'}>
            <input
              type="checkbox"
              value="Request technical training"
              name="mediaServices"
              {...register('mediaServices')}
            />
            Request technical training
          </label>
          <label key={'checkoutEquipment'}>
            <input
              type="checkbox"
              value="Checkout equipment"
              name="mediaServices"
              {...register('mediaServices')}
            />
            Checkout equipment
          </label>
          {roomNumber.includes('103') && (
            <label key={'103audioTechnician'}>
              <input
                type="checkbox"
                value="(For Garage 103) Request an audio technician"
                name="mediaServices"
                {...register('mediaServices')}
              />
              (For Garage 103) Request an audio technician
            </label>
          )}
          {roomNumber.includes('103') && (
            <label key={'103lightingTechnician'}>
              <input
                type="checkbox"
                value="(For Garage 103) Request a lighting technician"
                name="mediaServices"
                {...register('mediaServices')}
              />
              (For Garage 103) Request a lighting technician
            </label>
          )}
          {roomNumber.includes('230') && (
            <label key={'230lightingTechnician'}>
              <input
                type="checkbox"
                value="(For Audio Lab 230) Request an audio technician"
                name="mediaServices"
                {...register('mediaServices')}
              />
              (For Audio Lab 230) Request an audio technician
            </label>
          )}

          {roomNumber.includes('202') ||
            (roomNumber.includes('1201') && (
              <label key={'support'}>
                <input
                  type="checkbox"
                  value="(For 202 and 1201) Contact Campus Media for technical and event support"
                  name="mediaServices"
                  {...register('mediaServices')}
                />
                (For 202 and 1201) Contact Campus Media for technical and event
                support
              </label>
            ))}
        </div>
      </div>
      {watch('mediaServices') !== undefined && (
        <div className="mb-6">
          <label
            htmlFor="mediaServicesDetails"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            If you selected any of the Media Services above, please describe
            your needs in detail. (Ie. what kind of equipment you need to check
            out or the type of assistance you need from an audio technician)
          </label>
          <p className="text-xs"></p>
          <input
            type="text"
            id="mediaServicesDetails"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=""
            {...register('mediaServicesDetails')}
          />
        </div>
      )}
      <div className="mb-6">
        <label
          htmlFor="catering"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Catering
        </label>
        {errors.catering && <ErrorMessage errors={errors.catering.message} />}
        <div className="flex items-center mb-4">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register('catering', {
              required: true,
              validate: (value) => value !== '',
            })}
          >
            <option value="" disabled>
              Select option
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>
      {watch('catering') === 'yes' && (
        <div className="mb-6">
          <label
            htmlFor="cateringService"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Catering Information
          </label>
          <p className="text-xs">
            Including catering in your event necessitates hiring CBS cleaning
            services.
          </p>
          <div className="flex items-center mb-4">
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              {...register('cateringService')}
            >
              <option value="" disabled>
                Select option
              </option>
              <option value="Outside Catering">Outside Catering</option>
              <option selected value="NYU Plated">
                NYU Plated
              </option>
            </select>
          </div>
        </div>
      )}
      {watch('catering') === 'yes' && (
        <div className="mb-6">
          <label
            htmlFor="chartfieldInformation"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Chartfield Information
          </label>
          <p className="text-xs">
            It is required for the reservation holder to pay for CBS cleaning
            services if the event includes catering. The 370J Operations team
            will arrange for cleaning services with your chartfield information
            entered below.
          </p>
          <div className="flex items-center mb-4">
            <input
              type="textarea"
              id="chartfieldInformation"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
              {...register('chartfieldInformation')}
            />
          </div>
        </div>
      )}

      <div className="mb-6">
        <label
          htmlFor="hireSecurity"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Hire Security
        </label>
        <p className="text-xs">
          Only for large events with 75+ attendees, and bookings in The Garage
          where the Willoughby entrance will be in use. Once your booking is
          confirmed, it is your responsibility to hire Campus Safety for your
          event. If appropriate, please coordinate with your departmental
          Scheduling Liaison to hire Campus Safety, as there is a fee.
          <a
            href="https://www.nyu.edu/life/safety-health-wellness/campus-safety.html"
            target="_blank"
            className="text-blue-600 hover:underline dark:text-blue-500 mx-1"
          >
            Click for Campus Safety Form
          </a>
        </p>
        {errors.hireSecurity && (
          <ErrorMessage errors={errors.hireSecurity.message} />
        )}
        <div className="flex items-center mb-4">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register('hireSecurity', { required: true })}
          >
            <option value="">Select option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="checklist"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          I confirm receipt of the
          <a
            href="https://docs.google.com/document/d/1TIOl8f8-7o2BdjHxHYIYELSb4oc8QZMj1aSfaENWjR8/edit?usp=sharing"
            target="_blank"
            className="text-blue-600 hover:underline dark:text-blue-500 mx-1 mx-1"
          >
            370J Pre-Event Checklist
          </a>
          and acknowledge that it is my responsibility to setup various event
          services as detailed within the checklist. While the 370J Operations
          staff do setup cleaning services through CBS, they do not facilitate
          hiring security, catering, and arranging room setup services.
        </label>
        <div className="flex items-center mb-4">
          <input
            id="checklist"
            type="checkbox"
            value=""
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            onChange={() => setChecklist(!checklist)}
          />
          <label
            htmlFor="checklist"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            I agree
          </label>
        </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="resetRoom"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          I agree to reset any and all requested rooms and common spaces to
          their original state at the end of the event, including cleaning and
          furniture return, and will notify building staff of any problems,
          damage, or other concerns affecting the condition and maintenance of
          the reserved space. I understand that if I do not reset the room, I
          will lose reservation privileges.
        </label>
        <div className="flex items-center mb-4">
          <input
            id="resetRoom"
            type="checkbox"
            value=""
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            onChange={() => setResetRoom(!resetRoom)}
          />
          <label
            htmlFor="resetRoom"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            I agree
          </label>
        </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="agreement"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          I agree to the following attestations: <br /> * * I will not leave
          items behind. <br />* I will reset any furniture that I moved, and
          clean up after myself. <br /> * I will not secure anything to the
          pipes and ducting. <br /> * I will run cables along the grid to the
          edges of the room. <br /> * I will not use zip ties or duct tape on
          the ceiling grid or on any gear. <br /> * If I mount items to the
          grid, I will do so securely. I will secure excess cable to the grid so
          nothing is left dangling. <br /> * I will mount items to the grid
          using easily removable means e.g. clamps, hooks, carabiners, string
          with a bow-knot, masking or gaffer tape. <br /> * When I am done, I
          will remove everything including little bits of string and tape
          attached to gear.
        </label>
        <div className="flex items-center mb-4">
          <input
            id="agreement"
            type="checkbox"
            value=""
            onChange={() => setAgreement(!agreement)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="agreement"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            I agree
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="bookingPolicy"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          I have read the
          <a
            href="https://docs.google.com/document/d/1vAajz6XRV0EUXaMrLivP_yDq_LyY43BvxOqlH-oNacc/edit?usp=sharing"
            target="_blank"
            className="text-blue-600 hover:underline dark:text-blue-500 mx-1 mx-1"
          >
            Booking Policy for 370 Jay Street Shared Spaces
          </a>
          and agree to follow all policies outlined. I understand that I may
          lose access to spaces if I break this agreement.
        </label>
        <div className="flex items-center mb-4">
          <input
            id="bookingPolicy"
            type="checkbox"
            value=""
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            onChange={() => setBookingPolicy(!bookingPolicy)}
          />
          <label
            htmlFor="bookingPolicy"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            I agree
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={disabledButton}
        className={`${
          disabledButton && 'cursor-not-allowed'
        } text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
      >
        Submit
      </button>
    </form>
  );
};

export default FormInput;

FormInput.propTypes = {
  submitNewSheet: PropTypes.func,
};
