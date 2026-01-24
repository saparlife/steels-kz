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
          brand_id: string | null
          manufacturer_id: string | null
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
          brand_id?: string | null
          manufacturer_id?: string | null
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
          brand_id?: string | null
          manufacturer_id?: string | null
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
          has_warehouse: boolean
          warehouse_address_ru: string | null
          warehouse_address_kz: string | null
          meta_title_ru: string | null
          meta_title_kz: string | null
          meta_description_ru: string | null
          meta_description_kz: string | null
          description_ru: string | null
          description_kz: string | null
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
          has_warehouse?: boolean
          warehouse_address_ru?: string | null
          warehouse_address_kz?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          description_ru?: string | null
          description_kz?: string | null
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
          has_warehouse?: boolean
          warehouse_address_ru?: string | null
          warehouse_address_kz?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          description_ru?: string | null
          description_kz?: string | null
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
          category_id: string | null
          page_slug: string | null
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
          category_id?: string | null
          page_slug?: string | null
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
          category_id?: string | null
          page_slug?: string | null
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
      // New SEO tables
      brands: {
        Row: {
          id: string
          slug: string
          name_ru: string
          name_kz: string | null
          description_ru: string | null
          description_kz: string | null
          logo_url: string | null
          website_url: string | null
          meta_title_ru: string | null
          meta_title_kz: string | null
          meta_description_ru: string | null
          meta_description_kz: string | null
          is_active: boolean
          sort_order: number
          products_count: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name_ru: string
          name_kz?: string | null
          description_ru?: string | null
          description_kz?: string | null
          logo_url?: string | null
          website_url?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          is_active?: boolean
          sort_order?: number
          products_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name_ru?: string
          name_kz?: string | null
          description_ru?: string | null
          description_kz?: string | null
          logo_url?: string | null
          website_url?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          is_active?: boolean
          sort_order?: number
          products_count?: number
          created_at?: string
        }
      }
      manufacturers: {
        Row: {
          id: string
          slug: string
          name_ru: string
          name_kz: string | null
          description_ru: string | null
          description_kz: string | null
          country: string | null
          logo_url: string | null
          meta_title_ru: string | null
          meta_title_kz: string | null
          meta_description_ru: string | null
          meta_description_kz: string | null
          is_active: boolean
          sort_order: number
          products_count: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name_ru: string
          name_kz?: string | null
          description_ru?: string | null
          description_kz?: string | null
          country?: string | null
          logo_url?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          is_active?: boolean
          sort_order?: number
          products_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name_ru?: string
          name_kz?: string | null
          description_ru?: string | null
          description_kz?: string | null
          country?: string | null
          logo_url?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          is_active?: boolean
          sort_order?: number
          products_count?: number
          created_at?: string
        }
      }
      special_offers: {
        Row: {
          id: string
          slug: string
          title_ru: string
          title_kz: string | null
          description_ru: string | null
          description_kz: string | null
          image_url: string | null
          discount_percent: number | null
          valid_from: string | null
          valid_until: string | null
          meta_title_ru: string | null
          meta_title_kz: string | null
          meta_description_ru: string | null
          meta_description_kz: string | null
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title_ru: string
          title_kz?: string | null
          description_ru?: string | null
          description_kz?: string | null
          image_url?: string | null
          discount_percent?: number | null
          valid_from?: string | null
          valid_until?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title_ru?: string
          title_kz?: string | null
          description_ru?: string | null
          description_kz?: string | null
          image_url?: string | null
          discount_percent?: number | null
          valid_from?: string | null
          valid_until?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      offer_products: {
        Row: {
          id: string
          offer_id: string | null
          product_id: string | null
          special_price: number | null
        }
        Insert: {
          id?: string
          offer_id?: string | null
          product_id?: string | null
          special_price?: number | null
        }
        Update: {
          id?: string
          offer_id?: string | null
          product_id?: string | null
          special_price?: number | null
        }
      }
      documents: {
        Row: {
          id: string
          slug: string
          type: string
          title_ru: string
          title_kz: string | null
          description_ru: string | null
          description_kz: string | null
          file_url: string | null
          issuer: string | null
          issue_date: string | null
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          type: string
          title_ru: string
          title_kz?: string | null
          description_ru?: string | null
          description_kz?: string | null
          file_url?: string | null
          issuer?: string | null
          issue_date?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          type?: string
          title_ru?: string
          title_kz?: string | null
          description_ru?: string | null
          description_kz?: string | null
          file_url?: string | null
          issuer?: string | null
          issue_date?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      gost_standards: {
        Row: {
          id: string
          slug: string
          number: string
          title_ru: string
          title_kz: string | null
          description_ru: string | null
          description_kz: string | null
          content_ru: string | null
          content_kz: string | null
          document_url: string | null
          meta_title_ru: string | null
          meta_title_kz: string | null
          meta_description_ru: string | null
          meta_description_kz: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          number: string
          title_ru: string
          title_kz?: string | null
          description_ru?: string | null
          description_kz?: string | null
          content_ru?: string | null
          content_kz?: string | null
          document_url?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          number?: string
          title_ru?: string
          title_kz?: string | null
          description_ru?: string | null
          description_kz?: string | null
          content_ru?: string | null
          content_kz?: string | null
          document_url?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      steel_grades: {
        Row: {
          id: string
          slug: string
          name: string
          description_ru: string | null
          description_kz: string | null
          chemical_composition: Json | null
          mechanical_properties: Json | null
          applications_ru: string | null
          applications_kz: string | null
          gost_id: string | null
          meta_title_ru: string | null
          meta_title_kz: string | null
          meta_description_ru: string | null
          meta_description_kz: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description_ru?: string | null
          description_kz?: string | null
          chemical_composition?: Json | null
          mechanical_properties?: Json | null
          applications_ru?: string | null
          applications_kz?: string | null
          gost_id?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description_ru?: string | null
          description_kz?: string | null
          chemical_composition?: Json | null
          mechanical_properties?: Json | null
          applications_ru?: string | null
          applications_kz?: string | null
          gost_id?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      glossary_terms: {
        Row: {
          id: string
          slug: string
          term_ru: string
          term_kz: string | null
          definition_ru: string
          definition_kz: string | null
          meta_title_ru: string | null
          meta_title_kz: string | null
          meta_description_ru: string | null
          meta_description_kz: string | null
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          term_ru: string
          term_kz?: string | null
          definition_ru: string
          definition_kz?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          term_ru?: string
          term_kz?: string | null
          definition_ru?: string
          definition_kz?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      guides: {
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
          category: string | null
          meta_title_ru: string | null
          meta_title_kz: string | null
          meta_description_ru: string | null
          meta_description_kz: string | null
          is_active: boolean
          published_at: string
          created_at: string
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
          category?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          is_active?: boolean
          published_at?: string
          created_at?: string
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
          category?: string | null
          meta_title_ru?: string | null
          meta_title_kz?: string | null
          meta_description_ru?: string | null
          meta_description_kz?: string | null
          is_active?: boolean
          published_at?: string
          created_at?: string
        }
      }
      faq_categories: {
        Row: {
          id: string
          slug: string
          name_ru: string
          name_kz: string | null
          description_ru: string | null
          description_kz: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name_ru: string
          name_kz?: string | null
          description_ru?: string | null
          description_kz?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name_ru?: string
          name_kz?: string | null
          description_ru?: string | null
          description_kz?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      cases: {
        Row: {
          id: string
          slug: string
          title_ru: string
          title_kz: string | null
          client_name: string | null
          industry: string | null
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
        }
        Insert: {
          id?: string
          slug: string
          title_ru: string
          title_kz?: string | null
          client_name?: string | null
          industry?: string | null
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
        }
        Update: {
          id?: string
          slug?: string
          title_ru?: string
          title_kz?: string | null
          client_name?: string | null
          industry?: string | null
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
        }
      }
      leads: {
        Row: {
          id: string
          type: string
          name: string
          phone: string
          email: string | null
          company: string | null
          city: string | null
          message: string | null
          product_id: string | null
          category_id: string | null
          source_page: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          status: string
          manager_notes: string | null
          processed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          name: string
          phone: string
          email?: string | null
          company?: string | null
          city?: string | null
          message?: string | null
          product_id?: string | null
          category_id?: string | null
          source_page?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          status?: string
          manager_notes?: string | null
          processed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          name?: string
          phone?: string
          email?: string | null
          company?: string | null
          city?: string | null
          message?: string | null
          product_id?: string | null
          category_id?: string | null
          source_page?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          status?: string
          manager_notes?: string | null
          processed_at?: string | null
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

// Helper types for existing tables
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

// Helper types for new SEO tables
export type Brand = Database['public']['Tables']['brands']['Row']
export type Manufacturer = Database['public']['Tables']['manufacturers']['Row']
export type SpecialOffer = Database['public']['Tables']['special_offers']['Row']
export type OfferProduct = Database['public']['Tables']['offer_products']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type GostStandard = Database['public']['Tables']['gost_standards']['Row']
export type SteelGrade = Database['public']['Tables']['steel_grades']['Row']
export type GlossaryTerm = Database['public']['Tables']['glossary_terms']['Row']
export type Guide = Database['public']['Tables']['guides']['Row']
export type FAQCategory = Database['public']['Tables']['faq_categories']['Row']
export type Case = Database['public']['Tables']['cases']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']

// Extended types with relations
export interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[]
}

export interface ProductWithAttributes extends Product {
  attributes?: (ProductAttribute & { definition: AttributeDefinition })[]
  images?: Database['public']['Tables']['product_images']['Row'][]
  category?: Category
  brand?: Brand
  manufacturer?: Manufacturer
}

export interface SpecialOfferWithProducts extends SpecialOffer {
  products?: (OfferProduct & { product: Product })[]
}

export interface SteelGradeWithGost extends SteelGrade {
  gost?: GostStandard
}

export interface FAQWithCategory extends FAQ {
  faq_category?: FAQCategory
}
