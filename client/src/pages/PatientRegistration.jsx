// import React, { useState, useRef,useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../supabaseClient';

// const PatientRegistration = () => {
//     const navigate = useNavigate();
//     const [validationErrors, setValidationErrors] = useState({});
//     const [isSaving, setIsSaving] = useState(false);

//     const [patientDetails, setPatientDetails] = useState({
//         name: '',
//         phone_number: '',
//         address: '',
//         age: '',
//         gender: '',
//         mr_number: ''
//     });

//     // for last registered patient
//     const [lastRegisteredPatient, setLastRegisteredPatient] = useState(null);
//     const [isLoadingLastPatient, setIsLoadingLastPatient] = useState(false);


//     // Refs for input fields
//     const nameRef = useRef(null);
//     const phoneRef = useRef(null);
//     const addressRef = useRef(null);
//     const genderRef = useRef(null);
//     const ageRef = useRef(null);
//     const mrNumberRef = useRef(null);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setPatientDetails(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const validateForm = () => {
//         const errors = {};
//         if (!patientDetails.name.trim()) errors.name = "Name is required";
//         if (!patientDetails.phone_number.trim()) errors.phone_number = "Phone number is required";
//         if (!patientDetails.address.trim()) errors.address = "Address is required";
//         if (!patientDetails.age || parseInt(patientDetails.age) <= 0) errors.age = "Valid age is required";
//         if (!patientDetails.gender) errors.gender = "Gender is required";
//         if (!patientDetails.mr_number.trim()) errors.mr_number = "MR number is required";

//         setValidationErrors(errors);
//         return Object.keys(errors).length === 0;
//     };

//     // Function to fetch last registered patient
//     const fetchLastRegisteredPatient = async () => {
//         setIsLoadingLastPatient(true);
//         try {
//             const { data, error } = await supabase
//                 .from('patients')
//                 .select('mr_number, name, created_at')
//                 .order('created_at', { ascending: false })
//                 .limit(1);

//             if (error) throw error;
//             if (data && data.length > 0) {
//                 setLastRegisteredPatient(data[0]);
//             }
//         } catch (err) {
//             console.error('Error fetching last registered patient:', err);
//         } finally {
//             setIsLoadingLastPatient(false);
//         }
//     };

//     // Fetch last registered patient when component mounts
//     useEffect(() => {
//         fetchLastRegisteredPatient();
//     }, []);



//     const savePatientDetails = async () => {
//         if (!validateForm() || isSaving) return;

//         setIsSaving(true);
//         try {
//             // First check if patient with this MR number already exists
//             const { data: existingPatient, error: fetchError } = await supabase
//                 .from('patients')
//                 .select()
//                 .eq('mr_number', patientDetails.mr_number)
//                 .single();

//             if (fetchError && fetchError.code !== 'PGRST116') {
//                 // PGRST116 is the "not found" error code, any other error should be handled
//                 throw fetchError;
//             }

//             let result;
//             if (existingPatient) {
//                 // Update existing patient record
//                 result = await supabase
//                     .from('patients')
//                     .update({
//                         name: patientDetails.name,
//                         phone_number: patientDetails.phone_number,
//                         address: patientDetails.address,
//                         age: parseInt(patientDetails.age),
//                         gender: patientDetails.gender
//                     })
//                     .eq('mr_number', patientDetails.mr_number)
//                     .select();

//                 alert('Patient details updated successfully!');
//             } else {
//                 // Insert new patient record
//                 result = await supabase
//                     .from('patients')
//                     .insert([{
//                         name: patientDetails.name,
//                         phone_number: patientDetails.phone_number,
//                         address: patientDetails.address,
//                         age: parseInt(patientDetails.age),
//                         gender: patientDetails.gender,
//                         mr_number: patientDetails.mr_number
//                     }])
//                     .select();

//                 alert('Patient registered successfully!');
//                 await fetchLastRegisteredPatient();
//             }

//             if (result.error) throw result.error;
//             navigate('/dashboard');

//         } catch (error) {
//             console.error('Error saving patient details:', error);
//             setValidationErrors({
//                 submit: 'Failed to save patient details. Please try again.'
//             });
//         } finally {
//             setIsSaving(false);
//         }
//     };



//     return (
//         <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
//             <h2 className="text-2xl font-semibold text-gray-700 mb-6">Patient Registration</h2>
//             {/* Last Registered Patient Information */}
//             {lastRegisteredPatient && (
//                 <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6 flex justify-between items-center">
//                     <div>
//                         <h3 className="font-medium text-blue-800">Last Registered Patient</h3>
//                         <p className="text-sm">
//                             <span className="font-semibold">MR Number:</span> {lastRegisteredPatient.mr_number || 'N/A'}
//                         </p>
//                         <p className="text-sm">
//                             <span className="font-semibold">Name:</span> {lastRegisteredPatient.name || 'N/A'}
//                         </p>
//                         {lastRegisteredPatient.created_at && (
//                             <p className="text-sm text-gray-500">
//                                 {new Date(lastRegisteredPatient.created_at).toLocaleString()}
//                             </p>
//                         )}
//                     </div>
//                     <button
//                         type="button"
//                         onClick={fetchLastRegisteredPatient}
//                         className="text-blue-600 hover:text-blue-800"
//                         disabled={isLoadingLastPatient}
//                     >
//                         {isLoadingLastPatient ? 'Loading...' : 'Refresh'}
//                     </button>
//                 </div>
//             )}

//             <div className="space-y-4">
//                 <div>
//                     <label className="block text-gray-700 font-medium mb-1">Name</label>
//                     <input
//                         type="text"
//                         name="name"
//                         ref={nameRef}
//                         value={patientDetails.name}
//                         onChange={handleInputChange}
//                         className="border border-gray-300 w-full px-4 py-3 rounded-lg"
//                         placeholder="Enter patient name"
//                     />
//                     {validationErrors.name && (
//                         <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
//                     )}
//                 </div>

//                 <div>
//                     <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
//                     <input
//                         type="text"
//                         name="phone_number"
//                         ref={phoneRef}
//                         value={patientDetails.phone_number}
//                         onChange={handleInputChange}
//                         className="border border-gray-300 w-full px-4 py-3 rounded-lg"
//                         placeholder="Enter phone number"
//                     />
//                     {validationErrors.phone_number && (
//                         <p className="text-red-500 text-xs mt-1">{validationErrors.phone_number}</p>
//                     )}
//                 </div>

//                 <div>
//                     <label className="block text-gray-700 font-medium mb-1">Address</label>
//                     <input
//                         type="text"
//                         name="address"
//                         ref={addressRef}
//                         value={patientDetails.address}
//                         onChange={handleInputChange}
//                         className="border border-gray-300 w-full px-4 py-3 rounded-lg"
//                         placeholder="Enter address"
//                     />
//                     {validationErrors.address && (
//                         <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
//                     )}
//                 </div>

//                 <div>
//                     <label className="block text-gray-700 font-medium mb-1">Gender</label>
//                     <select
//                         name="gender"
//                         ref={genderRef}
//                         value={patientDetails.gender}
//                         onChange={handleInputChange}
//                         className="border border-gray-300 w-full px-4 py-3 rounded-lg"
//                     >
//                         <option value="">Select Gender</option>
//                         <option value="M">Male</option>
//                         <option value="F">Female</option>
//                         <option value="Other">Other</option>
//                     </select>
//                     {validationErrors.gender && (
//                         <p className="text-red-500 text-xs mt-1">{validationErrors.gender}</p>
//                     )}
//                 </div>

//                 <div>
//                     <label className="block text-gray-700 font-medium mb-1">Age</label>
//                     <input
//                         type="number"
//                         name="age"
//                         ref={ageRef}
//                         value={patientDetails.age}
//                         onChange={handleInputChange}
//                         className="border border-gray-300 w-full px-4 py-3 rounded-lg"
//                         placeholder="Enter age"
//                         min="1"
//                     />
//                     {validationErrors.age && (
//                         <p className="text-red-500 text-xs mt-1">{validationErrors.age}</p>
//                     )}
//                 </div>

//                 <div>
//                     <label className="block text-gray-700 font-medium mb-1">MR Number</label>
//                     <input
//                         type="text"
//                         name="mr_number"
//                         ref={mrNumberRef}
//                         value={patientDetails.mr_number}
//                         onChange={handleInputChange}
//                         className="border border-gray-300 w-full px-4 py-3 rounded-lg"
//                         placeholder="Enter MR number"
//                     />
//                     {validationErrors.mr_number && (
//                         <p className="text-red-500 text-xs mt-1">{validationErrors.mr_number}</p>
//                     )}
//                 </div>

//                 {validationErrors.submit && (
//                     <p className="text-red-500 text-sm">{validationErrors.submit}</p>
//                 )}

//                 <div className="flex justify-end space-x-4 mt-6">
//                     <button
//                         type="button"
//                         onClick={() => navigate('/dashboard')}
//                         className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="button"
//                         onClick={savePatientDetails}
//                         disabled={isSaving}
//                         className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
//                     >
//                         {isSaving ? 'Saving...' : 'Save Patient'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PatientRegistration;


import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const PatientRegistration = () => {
    const navigate = useNavigate();
    const [validationErrors, setValidationErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    
    // Add states for MR number lookup
    const [searchMrNumber, setSearchMrNumber] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    const [patientDetails, setPatientDetails] = useState({
        name: '',
        phone_number: '',
        address: '',
        age: '',
        gender: '',
        mr_number: ''
    });

    // for last registered patient
    const [lastRegisteredPatient, setLastRegisteredPatient] = useState(null);
    const [isLoadingLastPatient, setIsLoadingLastPatient] = useState(false);

    // Refs for input fields
    const searchMrNumberRef = useRef(null);
    const nameRef = useRef(null);
    const phoneRef = useRef(null);
    const addressRef = useRef(null);
    const genderRef = useRef(null);
    const ageRef = useRef(null);
    const mrNumberRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // MR number search function
    const handleMrNumberSearch = async () => {
        if (!searchMrNumber.trim()) {
            setSearchError('Please enter an MR number to search');
            return;
        }
        
        setIsSearching(true);
        setSearchError('');
        
        try {
            const { data, error } = await supabase
                .from('patients')
                .select('*')
                .eq('mr_number', searchMrNumber.trim())
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    setSearchError('No patient found with this MR number');
                } else {
                    throw error;
                }
            } else if (data) {
                // Populate the form with patient data
                setPatientDetails({
                    name: data.name || '',
                    phone_number: data.phone_number || '',
                    address: data.address || '',
                    age: data.age?.toString() || '',
                    gender: data.gender || '',
                    mr_number: data.mr_number || ''
                });
                setIsEditMode(true);
                // Focus on the name field after search
                setTimeout(() => nameRef.current?.focus(), 100);
            }
        } catch (error) {
            console.error('Error searching for patient:', error);
            setSearchError('An error occurred while searching. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    // Reset form function
    const resetForm = () => {
        setPatientDetails({
            name: '',
            phone_number: '',
            address: '',
            age: '',
            gender: '',
            mr_number: ''
        });
        setValidationErrors({});
        setSearchError('');
        setIsEditMode(false);
        setSearchMrNumber('');
        // Focus on the name field after reset
        setTimeout(() => nameRef.current?.focus(), 100);
    };

    const validateForm = () => {
        const errors = {};
        if (!patientDetails.name.trim()) errors.name = "Name is required";
        if (!patientDetails.phone_number.trim()) errors.phone_number = "Phone number is required";
        if (!patientDetails.address.trim()) errors.address = "Address is required";
        if (!patientDetails.age || parseInt(patientDetails.age) <= 0) errors.age = "Valid age is required";
        if (!patientDetails.gender) errors.gender = "Gender is required";
        if (!patientDetails.mr_number.trim()) errors.mr_number = "MR number is required";

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Function to fetch last registered patient
    const fetchLastRegisteredPatient = async () => {
        setIsLoadingLastPatient(true);
        try {
            const { data, error } = await supabase
                .from('patients')
                .select('mr_number, name, created_at')
                .order('created_at', { ascending: false })
                .limit(1);

            if (error) throw error;
            if (data && data.length > 0) {
                setLastRegisteredPatient(data[0]);
            }
        } catch (err) {
            console.error('Error fetching last registered patient:', err);
        } finally {
            setIsLoadingLastPatient(false);
        }
    };

    // Fetch last registered patient when component mounts
    useEffect(() => {
        fetchLastRegisteredPatient();
    }, []);

    const savePatientDetails = async () => {
        if (!validateForm() || isSaving) return;

        setIsSaving(true);
        try {
            // First check if patient with this MR number already exists
            const { data: existingPatient, error: fetchError } = await supabase
                .from('patients')
                .select()
                .eq('mr_number', patientDetails.mr_number)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                // PGRST116 is the "not found" error code, any other error should be handled
                throw fetchError;
            }

            let result;
            if (existingPatient) {
                // Update existing patient record
                result = await supabase
                    .from('patients')
                    .update({
                        name: patientDetails.name,
                        phone_number: patientDetails.phone_number,
                        address: patientDetails.address,
                        age: parseInt(patientDetails.age),
                        gender: patientDetails.gender
                    })
                    .eq('mr_number', patientDetails.mr_number)
                    .select();

                alert('Patient details updated successfully!');
            } else {
                // Insert new patient record
                result = await supabase
                    .from('patients')
                    .insert([{
                        name: patientDetails.name,
                        phone_number: patientDetails.phone_number,
                        address: patientDetails.address,
                        age: parseInt(patientDetails.age),
                        gender: patientDetails.gender,
                        mr_number: patientDetails.mr_number
                    }])
                    .select();

                alert('Patient registered successfully!');
                await fetchLastRegisteredPatient();
            }

            if (result.error) throw result.error;
            
            // Reset form after successful save
            resetForm();
            
            // Navigate to dashboard
            navigate('/dashboard');

        } catch (error) {
            console.error('Error saving patient details:', error);
            setValidationErrors({
                submit: 'Failed to save patient details. Please try again.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 mt-5">
                Patient Registration
            </h2>
            
            {/* MR Number Lookup Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Look up patient by MR Number</h3>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={searchMrNumber}
                        onChange={(e) => setSearchMrNumber(e.target.value)}
                        ref={searchMrNumberRef}
                        className="border border-gray-300 flex-1 px-4 py-2 rounded-lg"
                        placeholder="Enter MR number to search"
                        onKeyDown={(e) => e.key === 'Enter' && handleMrNumberSearch()}
                    />
                    <button
                        type="button"
                        onClick={handleMrNumberSearch}
                        disabled={isSearching}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isSearching ? 'Searching...' : 'Search'}
                    </button>
                    <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        New Patient
                    </button>
                </div>
                {searchError && (
                    <p className="text-red-500 text-sm mt-2">{searchError}</p>
                )}
            </div>

            {/* Mode indicator */}
            {isEditMode && (
                <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-3">
                    <p className="text-yellow-700">
                        <strong>Edit Mode:</strong> You are editing an existing patient record.
                    </p>
                </div>
            )}

            {/* Last Registered Patient Information */}
            {lastRegisteredPatient && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6 flex justify-between items-center">
                    <div>
                        <h3 className="font-medium text-blue-800">Last Registered Patient</h3>
                        <p className="text-sm">
                            <span className="font-semibold">MR Number:</span> {lastRegisteredPatient.mr_number || 'N/A'}
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold">Name:</span> {lastRegisteredPatient.name || 'N/A'}
                        </p>
                        {lastRegisteredPatient.created_at && (
                            <p className="text-sm text-gray-500">
                                {new Date(lastRegisteredPatient.created_at).toLocaleString()}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={fetchLastRegisteredPatient}
                        className="text-blue-600 hover:text-blue-800"
                        disabled={isLoadingLastPatient}
                    >
                        {isLoadingLastPatient ? 'Loading...' : 'Refresh'}
                    </button>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        ref={nameRef}
                        value={patientDetails.name}
                        onChange={handleInputChange}
                        className="border border-gray-300 w-full px-4 py-3 rounded-lg"
                        placeholder="Enter patient name"
                    />
                    {validationErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                    <input
                        type="text"
                        name="phone_number"
                        ref={phoneRef}
                        value={patientDetails.phone_number}
                        onChange={handleInputChange}
                        className="border border-gray-300 w-full px-4 py-3 rounded-lg"
                        placeholder="Enter phone number"
                    />
                    {validationErrors.phone_number && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.phone_number}</p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Address</label>
                    <input
                        type="text"
                        name="address"
                        ref={addressRef}
                        value={patientDetails.address}
                        onChange={handleInputChange}
                        className="border border-gray-300 w-full px-4 py-3 rounded-lg"
                        placeholder="Enter address"
                    />
                    {validationErrors.address && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Gender</label>
                    <select
                        name="gender"
                        ref={genderRef}
                        value={patientDetails.gender}
                        onChange={handleInputChange}
                        className="border border-gray-300 w-full px-4 py-3 rounded-lg"
                    >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {validationErrors.gender && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.gender}</p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Age</label>
                    <input
                        type="number"
                        name="age"
                        ref={ageRef}
                        value={patientDetails.age}
                        onChange={handleInputChange}
                        className="border border-gray-300 w-full px-4 py-3 rounded-lg"
                        placeholder="Enter age"
                        min="1"
                    />
                    {validationErrors.age && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.age}</p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">MR Number</label>
                    <input
                        type="text"
                        name="mr_number"
                        ref={mrNumberRef}
                        value={patientDetails.mr_number}
                        onChange={handleInputChange}
                        className="border border-gray-300 w-full px-4 py-3 rounded-lg"
                        placeholder="Enter MR number"
                        readOnly={isEditMode} // Make read-only when editing existing patient
                    />
                    {validationErrors.mr_number && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.mr_number}</p>
                    )}
                    {isEditMode && (
                        <p className="text-blue-500 text-xs mt-1">MR number cannot be changed for existing patients</p>
                    )}
                </div>

                {validationErrors.submit && (
                    <p className="text-red-500 text-sm">{validationErrors.submit}</p>
                )}

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={savePatientDetails}
                        disabled={isSaving}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : isEditMode ? 'Update Patient' : 'Save Patient'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientRegistration;