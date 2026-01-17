export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          parent_id: string | null
          slug: string
          name_ru: string
          name_kz: string | null
          description_ru: string | null
          description_kz: string | null
          meta_title_ru: string | null
          meta_title_kz: string | null
          meta_description_ru: string | null
          meta_description_kz: string | null
          image_url: string | null
          icon_url: string | null
          sort_order: number
          is_active: boolean
          products_count: number
          path: string[] | null
          level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id?: string | null
          slug: string
          name_ru: string
          name_kz?: string | null
          description_ru?: string | null
          description_kz?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          image_url?: string | null
          icon_url?: string | null
          sort_order?: number
          is_active?: boolean
          products_count?: number
          path?: string[] | null
          level?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string | null
          slug?: string
          name_ru?: string
          name_kz?: string | null
          description_ru?: string | null
          description_kz?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          image_url?: string | null
          icon_url?: string | null
          sort_order?: number
          is_active?: boolean
          products_count?: number
          path?: string[] | null
          level?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          category_id: string
          sku: string | null
          slug: string
          name_ru: string
          name_kz: string | null
          short_description_ru: string | null
          short_description_kz: string | null
          description_ru: string | null
          description_kz: string | null
          meta_title_ru: string | null
          meta_title_kz: string | null
          meta_description_ru: string | null
          meta_description_kz: string | null
          price: number | null
          old_price: number | null
          currency: string
          in_stock: boolean
          stock_quantity: number
          is_active: boolean
          is_featured: boolean
          sort_order: number
          views_count: number
          category_path: string[] | null
          source_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          sku?: string | null
          slug: string
          name_ru: string
          name_kz?: string | null
          short_description_ru?: string | null
          short_description_kz?: string | null
          description_ru?: string | null
          description_kz?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          price?: number | null
          old_price?: number | null
          currency?: string
          in_stock?: boolean
          stock_quantity?: number
          is_active?: boolean
          is_featured?: boolean
          sort_order?: number
          views_count?: number
          category_path?: string[] | null
          source_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          sku?: string | null
          slug?: string
          name_ru?: string
          name_kz?: string | null
          short_description_ru?: string | null
          short_description_kz?: string | null
          description_ru?: string | null
          description_kz?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          price?: number | null
          old_price?: number | null
          currency?: string
          in_stock?: boolean
          stock_quantity?: number
          is_active?: boolean
          is_featured?: boolean
          sort_order?: number
          views_count?: number
          category_path?: string[] | null
          source_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      attribute_definitions: {
        Row: {
          id: string
          slug: string
          name_ru: string
          name_kz: string | null
          type: string
          unit: string | null
          unit_kz: string | null
          options: string[] | null
          is_filterable: boolean
          is_searchable: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name_ru: string
          name_kz?: string | null
          type?: string
          unit?: string | null
          unit_kz?: string | null
          options?: string[] | null
          is_filterable?: boolean
          is_searchable?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name_ru?: string
          name_kz?: string | null
          type?: string
          unit?: string | null
          unit_kz?: string | null
          options?: string[] | null
          is_filterable?: boolean
          is_searchable?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      category_attributes: {
        Row: {
          id: string
          category_id: string
          attribute_id: string
          is_required: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          category_id: string
          attribute_id: string
          is_required?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          category_id?: string
          attribute_id?: string
          is_required?: boolean
          sort_order?: number
        }
      }
      product_attributes: {
        Row: {
          id: string
          product_id: string
          attribute_id: string
          value_text: string | null
          value_number: number | null
          value_boolean: boolean | null
        }
        Insert: {
          id?: string
          product_id: string
          attribute_id: string
          value_text?: string | null
          value_number?: number | null
          value_boolean?: boolean | null
        }
        Update: {
          id?: string
          product_id?: string
          attribute_id?: string
          value_text?: string | null
          value_number?: number | null
          value_boolean?: boolean | null
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt_ru: string | null
          alt_kz: string | null
          sort_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt_ru?: string | null
          alt_kz?: string | null
          sort_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt_ru?: string | null
          alt_kz?: string | null
          sort_order?: number
          is_primary?: boolean
          created_at?: string
        }
      }
      pages: {
        Row: {
          id: string
          slug: string
          title_ru: string
          title_kz: string | null
          content_ru: string | null
          content_kz: string | null
          meta_title_ru: string | null
          meta_title_kz: string | null
          meta_description_ru: string | null
          meta_description_kz: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title_ru: string
          title_kz?: string | null
          content_ru?: string | null
          content_kz?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title_ru?: string
          title_kz?: string | null
          content_ru?: string | null
          content_kz?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      news: {
        Row: {
          id: string
          slug: string
          title_ru: string
          title_kz: string | null
          excerpt_ru: string | null
          excerpt_kz: string | null
          content_ru: string | null
          content_kz: string | null
          image_url: string | null
          meta_title_ru: string | null
          meta_title_kz: string | null
          meta_description_ru: string | null
          meta_description_kz: string | null
          is_active: boolean
          published_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title_ru: string
          title_kz?: string | null
          excerpt_ru?: string | null
          excerpt_kz?: string | null
          content_ru?: string | null
          content_kz?: string | null
          image_url?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          is_active?: boolean
          published_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title_ru?: string
          title_kz?: string | null
          excerpt_ru?: string | null
          excerpt_kz?: string | null
          content_ru?: string | null
          content_kz?: string | null
          image_url?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          is_active?: boolean
          published_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value_ru: string | null
          value_kz: string | null
          type: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value_ru?: string | null
          value_kz?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value_ru?: string | null
          value_kz?: string | null
          type?: string
          updated_at?: string
        }
      }
      cities: {
        Row: {
          id: string
          slug: string
          name_ru: string
          name_kz: string | null
          phone: string | null
          email: string | null
          address_ru: string | null
          address_kz: string | null
          working_hours_ru: string | null
          working_hours_kz: string | null
          coordinates_lat: number | null
          coordinates_lng: number | null
          is_default: boolean
          sort_order: number
          is_active: boolean
        }
        Insert: {
          id?: string
          slug: string
          name_ru: string
          name_kz?: string | null
          phone?: string | null
          email?: string | null
          address_ru?: string | null
          address_kz?: string | null
          working_hours_ru?: string | null
          working_hours_kz?: string | null
          coordinates_lat?: number | null
          coordinates_lng?: number | null
          is_default?: boolean
          sort_order?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          slug?: string
          name_ru?: string
          name_kz?: string | null
          phone?: string | null
          email?: string | null
          address_ru?: string | null
          address_kz?: string | null
          working_hours_ru?: string | null
          working_hours_kz?: string | null
          coordinates_lat?: number | null
          coordinates_lng?: number | null
          is_default?: boolean
          sort_order?: number
          is_active?: boolean
        }
      }
      reviews: {
        Row: {
          id: string
          author_name: string
          company: string | null
          content_ru: string
          content_kz: string | null
          rating: number | null
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          author_name: string
          company?: string | null
          content_ru: string
          content_kz?: string | null
          rating?: number | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          author_name?: string
          company?: string | null
          content_ru?: string
          content_kz?: string | null
          rating?: number | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      faq: {
        Row: {
          id: string
          question_ru: string
          question_kz: string | null
          answer_ru: string
          answer_kz: string | null
          category: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          question_ru: string
          question_kz?: string | null
          answer_ru: string
          answer_kz?: string | null
          category?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          question_ru?: string
          question_kz?: string | null
          answer_ru?: string
          answer_kz?: string | null
          category?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      banners: {
        Row: {
          id: string
          title_ru: string | null
          title_kz: string | null
          subtitle_ru: string | null
          subtitle_kz: string | null
          image_url: string
          link_url: string | null
          position: string
          sort_order: number
          is_active: boolean
          starts_at: string | null
          ends_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title_ru?: string | null
          title_kz?: string | null
          subtitle_ru?: string | null
          subtitle_kz?: string | null
          image_url: string
          link_url?: string | null
          position?: string
          sort_order?: number
          is_active?: boolean
          starts_at?: string | null
          ends_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title_ru?: string | null
          title_kz?: string | null
          subtitle_ru?: string | null
          subtitle_kz?: string | null
          image_url?: string
          link_url?: string | null
          position?: string
          sort_order?: number
          is_active?: boolean
          starts_at?: string | null
          ends_at?: string | null
          created_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string
          role: string
          is_active: boolean
          last_login_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          name: string
          role?: string
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          name?: string
          role?: string
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type AttributeDefinition = Database['public']['Tables']['attribute_definitions']['Row']
export type ProductAttribute = Database['public']['Tables']['product_attributes']['Row']
export type Page = Database['public']['Tables']['pages']['Row']
export type News = Database['public']['Tables']['news']['Row']
export type City = Database['public']['Tables']['cities']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type FAQ = Database['public']['Tables']['faq']['Row']
export type Banner = Database['public']['Tables']['banners']['Row']
export type SiteSetting = Database['public']['Tables']['site_settings']['Row']

// Extended types with relations
export interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[]
}

export interface ProductWithAttributes extends Product {
  attributes?: (ProductAttribute & { definition: AttributeDefinition })[]
  images?: Database['public']['Tables']['product_images']['Row'][]
  category?: Category
}
