import { supabase } from "../lib/supabase";

export class Blog {
  static async all(page: number = 1, perPage: number = 10) {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, error, count } = await supabase
      .from("blogs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data,
      pagination: {
        total: count || 0,
        page,
        perPage,
        lastPage: Math.ceil((count || 0) / perPage),
      },
    };
  }

  static async search(
    searchTerm: string,
    page: number = 1,
    perPage: number = 10
  ) {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, error, count } = await supabase
      .from("blogs")
      .select("*", { count: "exact" })
      .or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data,
      pagination: {
        total: count || 0,
        page,
        perPage,
        lastPage: Math.ceil((count || 0) / perPage),
      },
    };
  }
}
