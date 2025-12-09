import { Metadata } from 'next';
import parse from 'html-react-parser';
import Image from 'next/image'; 

async function getPage(slug: string) {
  const res = await fetch('https://www.dikshantias.com/api/admin/pages');
  const pages = await res.json();
  return pages.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const page = await getPage(params.slug);
  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `https://www.dikshantias.com/${page.slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `https://www.dikshantias.com/${page.slug}`,
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);
 if (!page) {
  return (
    <div className="flex items-center justify-center h-[75vh] px-4">
      <div className="text-center">

        <h2 className="text-4xl font-bold text-gray-800">Page Not Found</h2>

        <p className="text-gray-500 mt-3 text-lg">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-block mt-6 px-6 py-2 rounded-lg text-white font-semibold shadow 
                     transition bg-[#C10007] hover:bg-red-700"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}



  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Display image if it exists */}
     {page.image?.url && (
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-3xl relative">
            <Image
              src={page.image.url}
              alt={page.image.alt || page.title}
              width={800}    
              height={450}
              className="rounded-lg object-cover"
              priority
            />
          </div>
        </div>
      )}
      <h1 className="text-4xl font-bold mb-6 text-gray-900">{page.title}</h1>
      <div className="
            max-w-none text-gray-800 leading-relaxed space-y-8
            [&>h1]:text-3xl [&>h1]:mt-10 [&>h1]:mb-6
            [&>h2]:text-2xl [&>h2]:mt-8 [&>h2]:mb-5
            [&>h3]:text-xl [&>h3]:mt-6 [&>h3]:mb-4
            [&>p]:mb-6
            [&>ul]:list-disc [&>ul]:pl-8 [&>ul]:mb-6
            [&>ol]:list-decimal [&>ol]:pl-8 [&>ol]:mb-6
            [&>li]:mb-3
            [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:my-6
            [&>img]:rounded-lg [&>img]:my-8
          ">
        {parse(page.content)}
      </div>

    </div>
  );
}




