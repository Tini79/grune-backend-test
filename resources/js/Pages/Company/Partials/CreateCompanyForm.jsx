import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { router, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { Image } from 'primereact/image';
import { Calendar } from 'primereact/calendar';
import { useRef } from 'react';
import { useGlobalContext } from '@/Layouts/layout/context/layoutcontext';
import { useEffect } from 'react';
import { useState } from 'react';
import { Tooltip } from 'primereact/tooltip';
import { Button } from 'primereact/button';
import axios from 'axios';

export default function CreateCompanyForm({ className = '', company }) {
    const { toast } = useGlobalContext();
    const { prefectures, flash, image_url } = usePage().props;
    const startDate = useRef("");
    const endDate = useRef("");
    const startHour = useRef("");
    const endHour = useRef("");
    const prefectureName = useRef(null);
    const phone = useRef("");
    const fileUploadRef = useRef(null);
    const [existingImageUrl, setExistingImageUrl] = useState(image_url ? `/storage/${image_url}` : null);
    const { data, setData, post, errors, reset, processing, recentlySuccessful } = useForm({
        name: company && company.length > 0 ? company[0].name : "",
        email: company && company.length > 0 ? company[0].email : "",
        prefecture_id: company && company.length > 0 ? company[0].prefecture_id : "",
        phone: company && company.length > 0 ? company[0].phone : "",
        postcode: company && company.length > 0 ? company[0].postcode : "",
        city: company && company.length > 0 ? company[0].city : "",
        local: company && company.length > 0 ? company[0].local : "",
        street_address: company && company.length > 0 ? company[0].street_address : "",
        business_hour: company && company.length > 0 ? company[0].business_hour : "",
        regular_holiday: company && company.length > 0 ? company[0].regular_holiday : "",
        image: null,
        fax: company && company.length > 0 ? company[0].fax : "",
        url: company && company.length > 0 ? company[0].url : "",
        license_number: company && company.length > 0 ? company[0].license_number : "",
        _method: company && company.length > 0 ? 'PUT' : 'POST'
    });

    useEffect(() => {
        if (company && company.length > 0) {
            const initialSDate = new Date();
            const initialEDate = new Date();
            const businessHour = company[0].business_hour.split(' – ');

            const initialSHour = businessHour[0].split(':')[0];
            const initialSMinute = businessHour[0].split(':')[1];
            const initialEHour = businessHour[1].split(':')[0];
            const initialEMinute = businessHour[1].split(':')[1];

            initialSDate.setHours(initialSHour, initialSMinute, 0, 0);
            initialEDate.setHours(initialEHour, initialEMinute, 0, 0);

            startDate.current = initialSDate;
            endDate.current = initialEDate;
            startHour.current = businessHour[0];
            endHour.current = businessHour[1];

            phone.current = company[0].phone;
            // set prefecture

            prefectureName.current = prefectures.find(p => p.id == company[0].prefecture_id);
        } else {
            const initialDate = new Date();

            startDate.current = initialDate;
            endDate.current = initialDate;
        }
    }, [])

    useEffect(() => {
        if (flash?.message) {
            toast.current.show({
                severity: flash?.type ?? 'info',
                summary: flash?.type == 'success' ? 'Notification' : 'Error',
                detail: flash.message,
                life: 4000,
            });
        }
    }, [flash]);

    // changes handlers
    const changeStartHour = (dateTime) => {
        const date = new Date(dateTime);
        const hour = date.getHours();
        const minute = date.getMinutes();
        const time = `${hour} : ${minute}`;

        startDate.current = dateTime;
        startHour.current = time;
        updateBusinessHour(time, "")
    }

    const changeEndHour = (dateTime) => {
        const date = new Date(dateTime);
        const hour = date.getHours();
        const minute = date.getMinutes();
        const time = `${hour} : ${minute}`;

        endDate.current = dateTime;
        endHour.current = time;
        updateBusinessHour("", time)
    }

    const onSelectPrefect = (e) => {
        prefectureName.current = e.target.value;
        setData('prefecture_id', e.target.value.id);
        // TODO: kalo aktif, prefecture id
        // resetLocation(true);
    }

    const onChangePhone = (e) => {
        phone.current = e.target.value;
        setData('phone', parseInt(e.target.value));
    }

    // general functions
    const searchPrefectByPostcode = async () => {
        await fetchPostcodeData(data.postcode);
    }

    const updateBusinessHour = (start, end) => {
        if (start) {
            setData('business_hour', `${start} – ${endHour.current}`)
        } else if (end) {
            setData('business_hour', `${startHour.current} – ${end}`)
        }
    }

    const resetLocation = (onChangePrefect = false) => {
        reset('city', 'local');
        if (!onChangePrefect) prefectureName.current = '';
    }

    const getError = (err) => {
        toast.current.show({
            severity: 'warn',
            summary: 'Error',
            detail: "Server Error. We couldn't complete your request due to a temporary issue on our system. Please try again in a moment.",
            life: 4000,
        });
    }

    const submit = (e) => {
        e.preventDefault();
        if (company) {
            post(route('company.update', { id: company[0].id }), {
                onSuccess: () => {
                    reset();
                }
            });
        } else {
            post(route('company.store'), {
                onSuccess: () => {
                    reset();
                }
            });
        }
    };

    // uploading image
    const onTemplateSelect = (e) => {
        const uploadedFile = e.files[0];

        if (uploadedFile) {
            setData('image', uploadedFile);
            setExistingImageUrl(uploadedFile.objectURL);
        }
    };

    const onTemplateClear = (e) => {
        if (!e) setExistingImageUrl(null);
    }

    // API requests
    const fetchPostcodeData = async (postcode) => {
        try {
            const params = {
                postcode: postcode
            };
            const res = await axios.get(route('postcodes.data'), { params: params });
            const respData = res.data.data;
            if (respData) {
                const selectedPrefect = prefectures.find(p => p.display_name == respData.prefecture);
                setData({
                    ...data,
                    city: respData.city,
                    local: respData.local,
                    prefecture_id: selectedPrefect.id
                });

                prefectureName.current = selectedPrefect;
            } else {
                resetLocation();
            }
        } catch (err) {
            getError(err);
        }
    }

    const itemTemplate = (image, index) => {
        return (
            <div className="p-2">
                <img
                    src={image.objectURL}
                    alt={image.name}
                    className="w-full object-cover rounded-lg shadow"
                />
            </div>
        );
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium">Company Information</h2>
            </header>
            <form onSubmit={submit} className="mt-4 space-y-6" encType="multipart/form-data">
                <div className="flex gap-3 mb-3">
                    <div className="w-full">
                        <label htmlFor="name" className="block text-900 font-medium mb-2">Name</label>
                        <InputText
                            id="name"
                            type="text"
                            placeholder="Name"
                            className="w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} className="" />
                    </div>
                    <div className="w-full">
                        <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                        <InputText
                            id="email"
                            type="text"
                            placeholder="Email address"
                            className="w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="" />
                    </div>
                </div>

                <div className="flex gap-3 mb-3">
                    <div className="w-full">
                        <label htmlFor="prefecture" className="block text-900 font-medium mb-2">Prefecture</label>
                        <Dropdown
                            id="prefecture"
                            type="text"
                            placeholder="Prefecture"
                            options={prefectures}
                            className="w-full"
                            optionLabel="display_name"
                            value={prefectureName.current}
                            onChange={(e) => onSelectPrefect(e)}
                        />
                        <InputError message={errors.prefecture_id} className="" />
                    </div>
                    <div className="w-full">
                        <label htmlFor="phone" className="block text-900 font-medium mb-2">Phone</label>
                        <InputText
                            id="phone"
                            type="text"
                            placeholder="Phone"
                            className="w-full"
                            value={phone.current}
                            onChange={(e) => onChangePhone(e)}
                        />
                        <InputError message={errors.phone} className="" />
                    </div>
                </div>

                <div className="flex gap-3 mb-3">
                    <div className="w-full">
                        <label htmlFor="postcode" className="block text-900 font-medium mb-2">Post Code</label>
                        <div className="flex">
                            <InputText
                                id="postcode"
                                type="text"
                                placeholder="Post code"
                                className="w-full"
                                value={data.postcode}
                                onChange={(e) => setData('postcode', e.target.value)}
                                style={{ borderRadius: '0.375rem 0 0 0.375rem' }}
                            />
                            <Button
                                icon="pi pi-search"
                                type="button"
                                onClick={searchPrefectByPostcode}
                                style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                            />
                        </div>
                        <InputError message={errors.postcode} className="" />
                    </div>
                    <div className="w-full">
                        <label htmlFor="city" className="block text-900 font-medium mb-2">City</label>
                        <InputText
                            id="city"
                            type="text"
                            placeholder="City"
                            className="w-full"
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                        />
                        <InputError message={errors.city} className="" />
                    </div>
                </div>

                <div className="flex gap-3 mb-3">
                    <div className="w-full">
                        <label htmlFor="local" className="block text-900 font-medium mb-2">Local</label>
                        <InputText
                            id="local"
                            type="text"
                            placeholder="Local"
                            className="w-full"
                            value={data.local}
                            onChange={(e) => setData('local', e.target.value)}
                        />
                        <InputError message={errors.local} className="" />
                    </div>
                    <div className="w-full">
                        <label htmlFor="streetAddress" className="block text-900 font-medium mb-2">Street</label>
                        <InputText
                            id="streetAddress"
                            type="text"
                            placeholder="Street address"
                            className="w-full"
                            value={data.street_address}
                            onChange={(e) => setData('street_address', e.target.value)}
                        />
                        <InputError message={errors.street_address} className="" />
                    </div>
                </div>

                <div className="flex gap-3 mb-3">
                    <div className="w-full">
                        <label htmlFor="businessHour" className="block text-900 font-medium mb-2">Business Hour</label>
                        {/* TODO: erro validation */}
                        <div className="flex gap-2">
                            <Calendar
                                id="startHour"
                                className="w-full"
                                timeOnly
                                value={startDate.current}
                                onChange={(e) => changeStartHour(e.target.value)}
                            />
                            <Calendar
                                id="endHour"
                                className="w-full"
                                timeOnly
                                value={endDate.current}
                                onChange={(e) => changeEndHour(e.target.value)}
                            />
                        </div>
                        {/* <InputError message={errors.business_hour} className="" /> */}
                    </div>
                    <div className="w-full">
                        <label htmlFor="regularHoliday" className="block text-900 font-medium mb-2">Regular Holiday</label>
                        <InputText
                            id="regularHoliday"
                            type="text"
                            placeholder="Regular Holiday"
                            className="w-full"
                            value={data.regular_holiday}
                            onChange={(e) => setData('regular_holiday', e.target.value)}
                        />
                        <InputError message={errors.regular_holiday} className="" />
                    </div>
                </div>

                <div className="flex gap-3 mb-3">
                    <div className="w-full">
                        <label htmlFor="image" className="block text-900 font-medium mb-2">Image</label>
                        {/* <InputText
                            id="image"
                            type="text"
                            placeholder="Image"
                            className="w-full"
                            value={data.image}
                            onChange={(e) => setData('image', e.target.value)}
                        /> */}
                        <div className="">
                            {/* {existingImageUrl && !data.image ? ( */}
                            <div className="">
                                <FileUpload
                                    mode="basic"
                                    ref={fileUploadRef}
                                    name="image"
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    onSelect={onTemplateSelect}
                                    onClear={onTemplateClear}
                                    chooseLabel={existingImageUrl ? 'Change Image' : 'Choose'}
                                    chooseOptions={{
                                        icon: `${existingImageUrl ? 'pi pi-refresh' : 'pi pi-plus'}`,
                                    }}
                                />
                                <div className="mt-2">
                                    <Image src={existingImageUrl} width="100" className="w-full" />
                                </div>
                            </div>
                            {/* <FileUpload
                                ref={fileUploadRef}
                                name="image"
                                accept="image/*"
                                maxFileSize={1000000}
                                onSelect={onTemplateSelect}
                                itemTemplate={itemTemplate}
                                chooseOptions={{ label: 'Choose Image', icon: 'pi pi-add' }}
                                uploadOptions={{ style: { display: 'none' } }}
                                cancelOptions={{ style: { display: 'none' } }}
                                customUpload
                            /> */}
                            {/* ) : (
                            )} */}
                        </div>
                        <InputError message={errors.image} className="" />
                    </div>
                    <div className="w-full">
                        <label htmlFor="fax" className="block text-900 font-medium mb-2">Fax</label>
                        <InputText
                            id="fax"
                            type="text"
                            placeholder="Fax"
                            className="w-full"
                            value={data.fax}
                            onChange={(e) => setData('fax', e.target.value)}
                        />
                        <InputError message={errors.fax} className="" />
                    </div>
                </div>

                <div className="flex gap-3 mb-3">
                    <div className="w-full">
                        <label htmlFor="url" className="block text-900 font-medium mb-2">Url</label>
                        <InputText
                            id="url"
                            type="text"
                            placeholder="Url"
                            className="w-full"
                            value={data.url}
                            onChange={(e) => setData('url', e.target.value)}
                        />
                        <InputError message={errors.url} className="" />
                    </div>
                    <div className="w-full">
                        <label htmlFor="licenseNumber" className="block text-900 font-medium mb-2">License Number</label>
                        <InputText
                            id="licenseNumber"
                            type="text"
                            placeholder="License Number"
                            className="w-full"
                            value={data.license_number}
                            onChange={(e) => setData('license_number', e.target.value)}
                        />
                        <InputError message={errors.license_number} className="" />
                    </div>
                </div>


                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}