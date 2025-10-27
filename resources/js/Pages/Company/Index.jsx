import Layout from "@/Layouts/layout/layout.jsx";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { router, useForm, usePage } from "@inertiajs/react";
import { Button } from 'primereact/button';
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { useRef } from "react";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import PrimaryButton from "@/Components/PrimaryButton";
import { useEffect } from "react";
import { useGlobalContext } from "@/Layouts/layout/context/layoutcontext";

const Company = ({ companies }) => {
  const { toast } = useGlobalContext();
  const { url } = usePage();
  const { flash } = usePage().props;
  const [currCompanies, setCurrCompanies] = useState([])
  const { data, setData, post, reset, processing } = useForm({
    keyword: '',
  })

  useEffect(() => {
    setCurrCompanies(companies);
  }, [])

  useEffect(() => {
    setCurrCompanies(companies);
  }, [companies])

  useEffect(() => {
    if (flash?.message) {

      if (toast.current) {
        toast.current.show({
          severity: flash?.type ?? 'info',
          summary: flash?.type == 'success' ? 'Notification' : 'Error',
          detail: flash.message,
          life: 4000,
        });
      }
    }
  }, [flash]);

  const submit = async (e) => {
    e.preventDefault();

    await fetchSearchedData(data.keyword);
  };

  // API requests
  const fetchSearchedData = async (keyword) => {
    try {
      const params = {
        keyword: keyword
      };
      const { data } = await axios.get(route('company.search'), { params: params });
      if (data.data) {
        setCurrCompanies(data.data);
      }
    } catch (err) {
      getError(err);
    }
  }

  return (
    <Layout>
      <div className="card mb-0">
        <div className="mb-2 flex gap-2">
          {/* TODO boleh tampilin search input juga, nanti tampilan inline sama ni button */}
          <form onSubmit={submit} className="w-full flex gap-1" encType="multipart/form-data">
            <InputText
              id="keyword"
              type="text"
              placeholder="Search ..."
              className="w-full"
              value={data.keyword}
              onChange={(e) => setData('keyword', e.target.value)}
            />
            <PrimaryButton disabled={processing}>Search</PrimaryButton>
          </form>
          <Button link label="Add" icon="pi pi-plus" iconPos="right" onClick={() => router.visit(route('company.create'))} style={{ backgroundColor: 'var(--primary-color)' }} className="font-bold text-white" />

        </div>
        <DataTable value={currCompanies} scrollable scrollHeight="400px" paginator rows={5} tableStyle={{ minWidth: '50rem' }}>
          <Column field="name" header="Name"></Column>
          {/* TODO:image tampilkan data imagenya */}
          <Column field="image" header="Image" body={displayImageTemplate}></Column>
          <Column field="email" header="Email"></Column>
          <Column field="postcode" header="Postcode"></Column>
          <Column field="prefecture.display_name" header="Prefecture"></Column>
          <Column field="city" header="City"></Column>
          <Column field="local" header="Local"></Column>
          <Column field="street_address" header="Street Address"></Column>
          <Column field="business_hour" header="Business Hour"></Column>
          <Column field="regular_holiday" header="Regular Holiday"></Column>
          <Column field="phone" header="Phone"></Column>
          <Column field="fax" header="Fax"></Column>
          <Column field="url" header="URL"></Column>
          <Column field="license_number" header="License Number"></Column>
          {/*  <Column field="balance" header="Balance" body={balanceTemplate} style={{ minWidth: '200px' }} alignFrozen="right" frozen={balanceFrozen}></Column> */}
          <Column field="action" header="Action" body={(rowData) => actionTemplate(rowData)} alignFrozen="right" frozen={true}></Column>
        </DataTable>
      </div>
    </Layout>
  )
}

const displayImageTemplate = (rowData) => {
  return (
    <Image src={rowData.image} width="100" alt={rowData.name} />
  )
}

const actionTemplate = (rowData) => {
  const [visible, setVisible] = useState(false);
  const companyID = useRef(0);

  const handleDelete = (companyId) => {
    companyID.current = companyId
    setVisible(true);
  }

  const deleteData = () => {
    router.delete(route('company.delete', companyID.current), {
      onFinish: () => {
        setVisible(false)
      }
    });
  }

  // internal component
  const footerContent = (
    <div className="pt-2">
      <Button label="Cancel" onClick={() => setVisible(false)} className="p-button-text" />
      <Button label="Delete" severity="danger" onClick={deleteData} autoFocus />
    </div>
  );

  return (
    <>
      <Dialog visible={visible} modal header="Confirmation" footer={footerContent} style={{ width: '28rem' }} contentStyle={{ borderRadiu: '0px' }} onHide={() => { if (!visible) return; setVisible(false); }}>
        <p className="py-4">
          Are you sure to delete this data?
        </p>
      </Dialog>
      <div className="flex gap-1">
        <Button icon="pi pi-pencil" link onClick={() => router.visit(route(`company.edit`, { id: rowData.id }))} />
        <Button icon="pi pi-trash" text severity="danger" onClick={() => handleDelete(rowData.id)} />
      </div>
    </>
  )
}

export default Company;