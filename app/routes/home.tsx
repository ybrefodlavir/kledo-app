import { useLoaderData, useSearchParams } from "react-router";
import { Map, Building2, MapPin, Funnel, ChevronDown } from "lucide-react";

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

  const breadcrumbItems = [
    { label: "Indonesia" },
    province && { label: province.name },
    regency && { label: regency.name },
    district && { label: district.name },
  ].filter(Boolean) as { label: string }[];

  function resetFilter() {
    setSearchParams(new URLSearchParams(), { replace: true });
  }

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-80 border-r p-6 space-y-6">
        <h2 className="font-semibold text-lg text-gray-400">Filter Wilayah</h2>

        <div>
          <label className="block text-sm mb-1">Provinsi</label>

          <div className="relative">
            <div className="absolute left-3 inset-y-0 flex items-center text-gray-600 pointer-events-none">
              <Map size={20} />
            </div>

            <select
              name="province"
              value={selectedProvince}
              onChange={(e) => updateParam("province", e.target.value)}
              className="
        w-full rounded-lg border border-gray-600
        bg-white text-black
        pl-14 pr-10
        py-2.5
        appearance-none
        leading-none
        focus:outline-none focus:ring-2 focus:ring-blue-500
      "
            >
              <option value="">Pilih Provinsi</option>
              {provinces.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="absolute right-3 inset-y-0 flex items-center text-gray-500 pointer-events-none">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Kota/Kabupaten</label>

          <div className="relative">
            <div className="absolute left-3 inset-y-0 flex items-center text-gray-600 pointer-events-none">
              <Building2 size={20} />
            </div>

            <select
              name="regency"
              value={selectedRegency}
              onChange={(e) => updateParam("regency", e.target.value)}
              disabled={!selectedProvince}
              className="
        w-full rounded-lg border border-gray-600
        bg-white text-black
        pl-14 pr-10
        py-2.5
        appearance-none
        leading-none
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:opacity-40
        disabled:cursor-not-allowed
      "
            >
              <option value="">Pilih Kota/Kabupaten</option>
              {filteredRegencies.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <div className="absolute right-3 inset-y-0 flex items-center text-gray-500 pointer-events-none">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Kecamatan</label>

          <div className="relative">
            <div className="absolute left-3 inset-y-0 flex items-center text-gray-600 pointer-events-none">
              <MapPin size={20} />
            </div>

            <select
              name="district"
              value={selectedDistrict}
              onChange={(e) => updateParam("district", e.target.value)}
              disabled={!selectedRegency}
              className="
        w-full rounded-lg border border-gray-600
        bg-white text-black
        pl-14 pr-10
        py-2.5
        appearance-none
        leading-none
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:opacity-40
        disabled:cursor-not-allowed
      "
            >
              <option value="">Pilih Kecamatan</option>
              {filteredDistricts.map((d: any) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <div className="absolute right-3 inset-y-0 flex items-center text-gray-500 pointer-events-none">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        <button
          onClick={resetFilter}
          disabled={!province && !regency && !district}
          className="
    w-full
    flex items-center justify-center gap-2

    rounded-full
    border-2 border-blue-500
    bg-white

    py-2.5
    px-4

    text-sm font-semibold
    uppercase tracking-wide
    text-gray-600

    transition-all duration-200

    hover:bg-blue-50
    hover:border-blue-600
    hover:text-blue-700

    active:scale-[0.97]

    focus:outline-none
    focus:ring-2
    focus:ring-blue-500/40

    disabled:opacity-40
    disabled:cursor-not-allowed
    disabled:hover:bg-white
  "
        >
          <Funnel size={16} />
          Reset
        </button>
      </aside>

      {/* BREAD KONTEN ATAS */}
      <div className="flex-1 p-10 space-y-10">
        <nav className="text-sm flex items-center flex-wrap">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;

            return (
              <span key={index} className="flex items-center">
                {index !== 0 && <span className="mx-2 text-gray-400">›</span>}

                <span
                  className={
                    isLast ? "text-blue-500 font-medium" : "text-gray-500"
                  }
                >
                  {item.label}
                </span>
              </span>
            );
          })}
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
