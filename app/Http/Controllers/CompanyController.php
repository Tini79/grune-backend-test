<?php
namespace App\Http\Controllers;

use App\Http\Requests\CompanyStoreRequest;
use App\Models\Company;
use App\Models\Prefecture;
use Exception;
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
        $companies = Company::with('prefecture')
            ->latest()
            ->get()
            ->map(function ($company) {
                $image = data_get($company, 'image');
                if ($image) {
                    $company->image = asset('storage/' . $image);
                }

                return $company;
            });

        return Inertia::render('Company/Index', [
            'companies' => $companies,
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
        try {
            $validated = $request->validated();

            if ($request->hasFile('image')) {
                $file               = $request->file('image');
                $path               = Company::uploadImage($file);
                $validated['image'] = $path;
            }

            Company::create($validated);
            return redirect()
                ->route('company.index')
                ->with('flash', [
                    'type'    => 'info',
                    'message' => 'succeed saving data',
                ]);
        } catch (Exception $e) {
            return back()
                ->with('flash', [
                    'type'    => 'danger',
                    'message' => 'failed saving data: ' . $e->getMessage(),
                ]);
        }
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
        // dd($id);
        $company = Company::with('prefecture')
            ->where('id', $id)
            ->get();

        // TODO: bikinin model?
        $image = data_get($company, 'image');
        if ($image) {
            $company->image = asset('storage/' . $image);
        }

        return Inertia::render('Company/Create', [
            'company' => $company,
        ]);
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
        $deleted = Company::deleteCompanyById($id);

        // TODO: test dan tampilkan pesan ke depan
        if ($deleted) {
            return back()->with('success', 'Company deleted succefully.');
        } else {
            return back()->with('error', 'Company not found.');
        }
    }
}