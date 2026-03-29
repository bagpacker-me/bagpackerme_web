import PackageForm from '@/components/admin/PackageForm';

export default function NewPackagePage() {
  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <div className="mb-7">
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          New Package
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Fill in the details to create a new travel package.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <PackageForm />
      </div>
    </div>
  );
}
