<?php
namespace App\Http\Controllers;

use App\Http\Requests\CompanyStoreRequest;
use App\Models\Company;
use App\Models\Prefecture;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Company/Index', [
            'companies' => Company::latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Company/Create', [
            'prefectures' => Prefecture::orderBy('name', 'desc')->get()->toArray(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(CompanyStoreRequest $request)
    public function store(CompanyStoreRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $file     = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();

            $path = $file->storeAs('public/images/companies', $filename);

            $validated['image'] = $path;
        }

        Company::create($validated);
        return Redirect::route('company.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Inertia::render('Company/Create');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $company = new Company();
        $company->deleteCompanyById($id);
    }
}
