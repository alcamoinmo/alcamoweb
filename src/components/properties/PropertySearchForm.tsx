import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const searchSchema = z.object({
  query: z.string().optional(),
  type: z.enum(['ALL', 'HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'OFFICE'] as const),
  status: z.enum(['ALL', 'FOR_SALE', 'FOR_RENT'] as const),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  bedrooms: z.enum(['ANY', '1', '2', '3', '4', '5+'] as const),
  bathrooms: z.enum(['ANY', '1', '2', '3', '4', '5+'] as const),
})

type SearchFormData = z.infer<typeof searchSchema>

interface PropertySearchFormProps {
  onSearch: (data: SearchFormData) => void
  initialValues?: Partial<SearchFormData>
}

export type { SearchFormData }
export default function PropertySearchForm({ onSearch, initialValues }: PropertySearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      type: 'ALL',
      status: 'ALL',
      bedrooms: 'ANY',
      bathrooms: 'ANY',
      ...initialValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSearch)} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-6">
        <div>
          <label htmlFor="query" className="block text-sm font-medium leading-6 text-gray-900">
            Search
          </label>
          <div className="mt-2">
            <input
              {...register('query')}
              type="text"
              id="query"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Location, property name, or keywords"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
              Property Type
            </label>
            <select
              {...register('type')}
              id="type"
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
              <option value="ALL">All Types</option>
              <option value="HOUSE">House</option>
              <option value="APARTMENT">Apartment</option>
              <option value="LAND">Land</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="OFFICE">Office</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
              Status
            </label>
            <select
              {...register('status')}
              id="status"
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
              <option value="ALL">All</option>
              <option value="FOR_SALE">For Sale</option>
              <option value="FOR_RENT">For Rent</option>
            </select>
          </div>

          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium leading-6 text-gray-900">
              Min Price
            </label>
            <input
              {...register('minPrice')}
              type="number"
              id="minPrice"
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>

          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium leading-6 text-gray-900">
              Max Price
            </label>
            <input
              {...register('maxPrice')}
              type="number"
              id="maxPrice"
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>

          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium leading-6 text-gray-900">
              Bedrooms
            </label>
            <select
              {...register('bedrooms')}
              id="bedrooms"
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
              <option value="ANY">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+</option>
            </select>
          </div>

          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium leading-6 text-gray-900">
              Bathrooms
            </label>
            <select
              {...register('bathrooms')}
              id="bathrooms"
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
              <option value="ANY">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Searching...' : 'Search Properties'}
        </button>
      </div>
    </form>
  )
} 