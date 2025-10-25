import Layout from "@/Layouts/layout/layout.jsx";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Link, router } from "@inertiajs/react";
import { Button } from 'primereact/button';
import { classNames } from "primereact/utils";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { useRef } from "react";

const Company = ({ companies }) => {
  return (
    <Layout>
      <div className="card mb-0">
        <div className="mb-2">
          {/* TODO boleh tampilin search input juga, nanti tampilan inline sama ni button */}
          {/* <Link href={route('company.create')} className="p-button font-bold">
            Create Company
            <i className="pi pi-plus ml-2"></i>
          </Link> */}
          <Button link label="Create Company" icon="pi pi-plus" iconPos="right" onClick={() => router.visit(route('company.create'))} style={{ backgroundColor: 'var(--primary-color)' }} className="font-bold text-white" />

        </div>
        <DataTable value={companies} scrollable scrollHeight="400px" tableStyle={{ minWidth: '50rem' }}>
          <Column field="name" header="Name"></Column>
          {/* TODO:image tampilkan data imagenya */}
          <Column field="prefecture" header="Image"></Column>
          <Column field="email" header="Email"></Column>
          <Column field="postcode" header="Postcode"></Column>
          {/* TODO: query data perlu relasi dg table ini dan tampilkan prefecture_name */}
          <Column field="prefecture_name" header="Prefecture"></Column>
          <Column field="email" header="City"></Column>
          <Column field="postcode" header="Local"></Column>
          <Column field="street_address" header="Street Address"></Column>
          <Column field="business_hour" header="Business Hour"></Column>
          <Column field="postcode" header="Regular Holiday"></Column>
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

const actionTemplate
  = (rowData) => {
    const [visible, setVisible] = useState(false);
    const companyID = useRef(0);

    const handleDelete = (companyId) => {
      companyID.current = companyId
      setVisible(true);
    }

    const deleteData = () => {
      router.delete(route('company.delete', companyID.current));
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
          <Button icon="pi pi-pencil" link onClick={() => router.visit(route('company.edit', rowData.id))} />
          <Button icon="pi pi-trash" text severity="danger" onClick={() => handleDelete(rowData.id)} />
        </div>
      </>
    )
  }

export default Company;