import Layout from "@/Layouts/layout/layout.jsx";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Link } from "@inertiajs/react";

const Company = ({ companies }) => {
  return (
    <Layout>
      <div className="card mb-0">
        <div className="mb-2">
          {/* TODO boleh tampilin search input juga, nanti tampilan inline sama ni button */}
          <Link href={route('company.create')} className="p-button font-bold">
            Create Company
            <i className="pi pi-plus ml-2"></i>
          </Link>
        </div>
        <DataTable value={companies} tableStyle={{ minWidth: '50rem' }}>
          <Column field="name" header="Name"></Column>
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
          {/* TODO:image tampilkan data imagenya */}
          <Column field="prefecture" header="Image"></Column>
        </DataTable>
      </div>
    </Layout>
  )
}

export default Company;