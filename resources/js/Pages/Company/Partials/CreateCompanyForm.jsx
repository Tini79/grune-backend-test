import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { router, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { Calendar } from 'primereact/calendar';
import { useRef } from 'react';
import { useGlobalContext } from '@/Layouts/layout/context/layoutcontext';
import { useEffect } from 'react';

export default function CreateCompanyForm({ className = '' }) {
    const { toast } = useGlobalContext();
    const { prefectures, flash } = usePage().props;
    const startDate = useRef("");
    const endDate = useRef("");
    const startHour = useRef("");
    const endHour = useRef("");
    const prefectureName = useRef("");
    const phone = useRef("");
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        name: "",
        email: "",
        prefecture_id: "",
        phone: "",
        postcode: "",
        city: "",
        local: "",
        street_address: "",
        business_hour: "",
        regular_holiday: "",
        image: null,
        fax: "",
        url: "",
        license_number: "",
    });

    useEffect(() => {
        if (flash?.message) {
            toast.current.show({
                severity: flash?.type ?? 'info',
                summary: 'Notification',
                detail: flash.message,
                life: 4000,
            });
        }
    }, [flash]);

    const changeStartHour = (dateTime) => {
        const date = new Date(dateTime);
        const hour = date.getHours();
        const minute = date.getMinutes();
        const time = `${hour} : ${minute}`;

        startDate.current = dateTime;
        startHour.current = time;
        updateBusinessHour("", time)
    }

    const changeEndHour = (dateTime) => {
        const date = new Date(dateTime);
        const hour = date.getHours();
        const minute = date.getMinutes();
        const time = `${hour} : ${minute}`;

        endDate.current = dateTime;
        endHour.current = time;
        updateBusinessHour(time, "")
    }

    const updateBusinessHour = (start, end) => {
        if (start) {
            setData('business_hour', `${start} – ${endHour.current}`)
        } else if (end) {
            setData('business_hour', `${startHour.current} – ${end}`)
        }
    }

    const onSelectPrefect = (e) => {
        prefectureName.current = e.value;
        setData('prefecture_id', e.target.value.id);
    }

    const onFileSelect = (e) => {
        setData('image', e.files[0]);
    }

    const onChangePhone = (e) => {
        phone.current = e.target.value;
        setData('phone', parseInt(e.target.value));
    }

    const submit = (e) => {
        e.preventDefault();

        post(route('company.store'));
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
                        <InputError message={errors.email} className="" />
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
                            optionLabel="name"
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
                        <InputText
                            id="postcode"
                            type="text"
                            placeholder="Post code"
                            className="w-full"
                            value={data.postcode}
                            onChange={(e) => setData('postcode', e.target.value)}
                        />
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
                        <FileUpload
                            mode="basic"
                            name="image"
                            // url="/api/upload"
                            accept="image/*"
                            maxFileSize={1000000}
                            onSelect={onFileSelect}
                        />
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
