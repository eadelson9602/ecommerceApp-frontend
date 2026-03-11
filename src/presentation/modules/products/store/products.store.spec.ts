import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductsStore } from './products.store'

describe('products.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('tiene filtros por defecto', () => {
    const store = useProductsStore()
    expect(store.filter).toEqual({
      page: 1,
      size: 20,
      status: '',
      search: '',
      sort: '',
    })
    expect(store.listTotalRecords).toBeNull()
  })

  it('setFilter actualiza solo los campos enviados', () => {
    const store = useProductsStore()
    store.setFilter({ page: 2, search: 'foo' })
    expect(store.filter.page).toBe(2)
    expect(store.filter.search).toBe('foo')
    expect(store.filter.size).toBe(20)
  })

  it('setListTotalRecords actualiza el total', () => {
    const store = useProductsStore()
    store.setListTotalRecords(100)
    expect(store.listTotalRecords).toBe(100)
    store.setListTotalRecords(null)
    expect(store.listTotalRecords).toBeNull()
  })
})
