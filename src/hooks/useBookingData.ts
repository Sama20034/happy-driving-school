import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Country {
  id: string;
  name: string;
  code: string | null;
}

export interface Governorate {
  id: string;
  name: string;
  country_id: string | null;
}

export interface Branch {
  id: string;
  governorate_id: string;
  name: string;
  address: string | null;
}

export interface Course {
  id: string;
  title: string;
  sessions: number;
  price: number;
  description: string | null;
}

export interface Captain {
  id: string;
  branch_id: string;
  name: string;
  image_url: string | null;
  rating: number | null;
}

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('id, name, code')
        .order('display_order');

      if (error) {
        setError(error.message);
      } else {
        setCountries(data || []);
      }
      setLoading(false);
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};

export const useGovernorates = (countryId?: string) => {
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGovernorates = async () => {
      setLoading(true);
      let query = supabase
        .from('governorates')
        .select('id, name, country_id')
        .order('display_order');

      if (countryId) {
        query = query.eq('country_id', countryId);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setGovernorates(data || []);
      }
      setLoading(false);
    };

    fetchGovernorates();
  }, [countryId]);

  return { governorates, loading, error };
};

export const useBranches = (governorateId: string) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!governorateId) {
      setBranches([]);
      setLoading(false);
      return;
    }

    const fetchBranches = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('branches')
        .select('id, governorate_id, name, address')
        .eq('governorate_id', governorateId)
        .order('display_order');

      if (error) {
        setError(error.message);
      } else {
        setBranches(data || []);
      }
      setLoading(false);
    };

    fetchBranches();
  }, [governorateId]);

  return { branches, loading, error };
};

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, sessions, price, description')
        .order('price');

      if (error) {
        setError(error.message);
      } else {
        setCourses(data || []);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
};

export interface CourseWithCustomPrice extends Course {
  customPrice: number;
  hasCustomPrice: boolean;
}

export const useCoursesWithPrices = (governorateId: string, branchId: string) => {
  const [courses, setCourses] = useState<CourseWithCustomPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoursesWithPrices = async () => {
      setLoading(true);
      
      // Fetch all courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, sessions, price, description')
        .order('price');

      if (coursesError) {
        setError(coursesError.message);
        setLoading(false);
        return;
      }

      // Fetch custom prices for the selected governorate and branch
      const { data: pricesData, error: pricesError } = await supabase
        .from('course_prices')
        .select('course_id, governorate_id, branch_id, price')
        .or(`governorate_id.eq.${governorateId},branch_id.eq.${branchId}`);

      if (pricesError) {
        setError(pricesError.message);
        setLoading(false);
        return;
      }

      // Apply pricing logic: branch price > governorate price > base price
      const coursesWithPrices: CourseWithCustomPrice[] = (coursesData || []).map(course => {
        // Look for branch-specific price first
        const branchPrice = pricesData?.find(
          p => p.course_id === course.id && p.branch_id === branchId
        );
        
        if (branchPrice) {
          return {
            ...course,
            customPrice: branchPrice.price,
            hasCustomPrice: true,
          };
        }

        // Look for governorate-specific price
        const govPrice = pricesData?.find(
          p => p.course_id === course.id && p.governorate_id === governorateId && !p.branch_id
        );
        
        if (govPrice) {
          return {
            ...course,
            customPrice: govPrice.price,
            hasCustomPrice: true,
          };
        }

        // Use base price
        return {
          ...course,
          customPrice: course.price,
          hasCustomPrice: false,
        };
      });

      setCourses(coursesWithPrices);
      setLoading(false);
    };

    if (governorateId && branchId) {
      fetchCoursesWithPrices();
    }
  }, [governorateId, branchId]);

  return { courses, loading, error };
};

export const useCaptains = (branchId: string) => {
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!branchId) {
      setCaptains([]);
      setLoading(false);
      return;
    }

    const fetchCaptains = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('captains')
        .select('id, branch_id, name, image_url, rating')
        .eq('branch_id', branchId)
        .order('rating', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setCaptains(data || []);
      }
      setLoading(false);
    };

    fetchCaptains();
  }, [branchId]);

  return { captains, loading, error };
};
