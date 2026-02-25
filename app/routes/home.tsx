import { useLoaderData, useSearchParams } from "react-router";

export async function loader({ request }: { request: Request }) {
  const dataUrl = new URL("/data/indonesia_regions.json", request.url);
  const res = await fetch(dataUrl);

  if (!res.ok) {
    throw new Response("Failed to load data", { status: 500 });
  }

  return res.json();
}

export default function Home() {
  const { provinces, regencies, districts } = useLoaderData() as any;

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedProvince = searchParams.get("province") || "";
  const selectedRegency = searchParams.get("regency") || "";
  const selectedDistrict = searchParams.get("district") || "";

  const filteredRegencies = selectedProvince
    ? regencies.filter(
        (regency: any) => regency.province_id === Number(selectedProvince),
      )
    : [];

  const filteredDistricts = selectedRegency
    ? districts.filter(
        (district: any) => district.regency_id === Number(selectedRegency),
      )
    : [];

  const province = provinces.find(
    (p: any) => p.id === Number(selectedProvince),
  );
  const regency = regencies.find((r: any) => r.id === Number(selectedRegency));
  const district = districts.find(
    (d: any) => d.id === Number(selectedDistrict),
  );

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key === "province") {
      params.delete("regency");
      params.delete("district");
    }

    if (key === "regency") {
      params.delete("district");
    }

    setSearchParams(params);
  }

  function resetFilter() {
    setSearchParams(new URLSearchParams(), { replace: true });
  }

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-80 border-r p-6 space-y-6">
        <h2 className="font-semibold text-lg">Filter Wilayah</h2>

        <div>
          <label className="block text-sm mb-1">Provinsi</label>
          <select
            name="province"
            value={selectedProvince}
            onChange={(e) => updateParam("province", e.target.value)}
            className="w-full rounded-lg border border-gray-600
                bg-white-900 text-black
                px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" className="bg-white text-black">
              Pilih Provinsi
            </option>
            {provinces.map((p: any) => (
              <option key={p.id} value={p.id} className="bg-white text-black">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Kota/Kabupaten</label>
          <select
            name="regency"
            value={selectedRegency}
            onChange={(e) => updateParam("regency", e.target.value)}
            className="w-full rounded-lg border border-gray-600
                bg-white-900 text-black
                px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!selectedProvince}
          >
            <option value="" className="bg-white text-black">
              Pilih Kota/Kabupaten
            </option>
            {filteredRegencies.map((r: any) => (
              <option key={r.id} value={r.id} className="bg-white text-black">
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Kecamatan</label>
          <select
            name="district"
            value={selectedDistrict}
            onChange={(e) => updateParam("district", e.target.value)}
            className="w-full rounded-lg border border-gray-600
                bg-white-900 text-black
                px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!selectedRegency}
          >
            <option value="" className="bg-white text-black">
              Pilih Kecamatan
            </option>
            {filteredDistricts.map((d: any) => (
              <option key={d.id} value={d.id} className="bg-white text-black">
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={resetFilter}
          disabled={!province && !district}
          className="
    w-full
    rounded-lg
    border border-gray-700
    bg-white-900
    py-2.5
    text-black-300
    transition-all duration-150

    hover:bg-gray-800
    hover:text-white
    hover:border-gray-500

    active:scale-[0.98]

    focus:outline-none
    focus:ring-2
    focus:ring-blue-500/40

    disabled:opacity-40
    disabled:cursor-not-allowed
    disabled:hover:bg-gray-900
  "
        >
          Reset Filter
        </button>
      </aside>

      {/* BREAD KONTEN ATAS */}
      <div className="flex-1 p-10 space-y-10">
        <nav className="breadcrumb text-sm text-gray-500 space-x-2">
          <span>Indonesia</span>
          {province && <span> › {province.name}</span>}
          {regency && <span> › {regency.name}</span>}
          {district && <span> › {district.name}</span>}
        </nav>

        {/* MAIN KONTEN */}
        <main className="space-y-16 text-center">
          {province && (
            <div>
              <p className="text-blue-500 tracking-widest text-sm">PROVINSI</p>
              <h1 className="text-4xl font-bold">{province.name}</h1>
            </div>
          )}

          {regency && (
            <div>
              <p className="text-blue-500 tracking-widest text-sm">
                KOTA / KABUPATEN
              </p>
              <h1 className="text-4xl font-bold">{regency.name}</h1>
            </div>
          )}

          {district && (
            <div>
              <p className="text-blue-500 tracking-widest text-sm">KECAMATAN</p>
              <h1 className="text-3xl font-bold">{district.name}</h1>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
