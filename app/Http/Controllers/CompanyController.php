<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompanyStoreRequest;
use App\Models\Company;
use App\Models\Postcode;
use App\Models\Prefecture;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
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
     * 
     */
    public function searchCompany(Request $request)
    {
        $keyword = $request->input('keyword');

        $res = Company::with('prefecture')
            ->where(function ($query) use ($keyword) {
                $query->where('name', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('email', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('postcode', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('city', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('local', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('street_address', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('business_hour', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('regular_holiday', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('phone', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('fax', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('url', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('license_number', 'LIKE', '%' . $keyword . '%');
                $query->orWhereHas('prefecture', function ($q) use ($keyword) {
                    $q->where('display_name', 'LIKE', '%' . $keyword . '%');
                });
            })
            ->latest()
            ->get()
            ->map(function ($company) {
                $image = data_get($company, 'image');
                if ($image) {
                    $company->image = asset('storage/' . $image);
                }

                return $company;
            });

        // $res->getCollection()->transform(function ($company) {
        //     $image = data_get($company, 'image');
        //     if ($image) {
        //         $company->image = asset('storage/' . $image);
        //     }

        //     return $company;
        // });

        return response()->json([
            'data' => $res,
            'message' => 'search completed'
        ]);
    }

    /**
     * Retrieves postcode records based on a prefecture ID query.
     *
     * Designed to serve an AJAX request, allowing dynamic fetching of location data.
     *
     * @param \Illuminate\Http\Request $request The HTTP request object.
     * Expects 'prefecture' as a query parameter (e.g., ?prefecture=15).
     *
     * @return \Illuminate\Http\JsonResponse 
     * Returns JSON containing the postcode data or a status message.
     */
    public function getFilteredPostcodes(Request $request)
    {
        $postcode = $request->query('postcode');
        $cleaned = ltrim($postcode, '0');

        if (!$postcode) {
            return response()->json(['data' => null, 'message' => 'prefecture id is missing'], 400);
        }

        $res = Postcode::where('postcode', 'LIKE', '%' . $cleaned . '%')
            ->first();

        return response()->json([
            'data' => $res,
            'message' => 'succeed filtering postcode data'
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Company/Create', [
            'prefectures' => Prefecture::orderBy('name', 'desc')->get(),
            'postcode'
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
                    'type'    => 'success',
                    'message' => 'succeed saving data',
                ]);
        } catch (Exception $e) {
            return back()
                ->with('flash', [
                    'type'    => 'warn',
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
        $company = Company::with('prefecture')
            ->where('id', $id)
            ->get();

        $image = data_get($company, 'image');
        if ($image) {
            $company->image = asset('storage/' . $image);
        }

        return Inertia::render('Company/Edit', [
            'company' => $company,
            'prefectures' => Prefecture::orderBy('name', 'desc')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CompanyStoreRequest $request, string $id)
    {
        try {
            $company = Company::findOrFail($id);
            $validated = $request->validated();
            if ($request->hasFile('image')) {
                $file               = $request->file('image');
                $path               = Company::uploadImage($file);
                $validated['image'] = $path;

                if ($file) {
                    // Pastikan Anda hanya menghapus file yang ada di disk 'public'
                    Storage::disk('public')->delete($file);
                }
            }

            $company->update($validated);
            return redirect()
                ->route('company.index')
                ->with('flash', [
                    'type'    => 'success',
                    'message' => 'succeed saving data',
                ]);
        } catch (Exception $e) {
            // TODO: semua toast belum mau tampil, fix segera
            return back()
                ->with('flash', [
                    'type'    => 'warn',
                    'message' => 'failed saving data: ' . $e->getMessage(),
                ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $deleted = Company::deleteCompanyById($id);

        // TODO: test dan tampilkan pesan ke depan
        if ($deleted) {
            return back()->with(
                'flash',
                [
                    'type'    => 'success',
                    'message' => 'company deleted succefully',
                ]
            );
        } else {
            return back()->with(
                'flash',
                [
                    'type'    => 'warn',
                    'message' => 'company not found',
                ]
            );
        }
    }
}
