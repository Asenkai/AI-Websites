import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { PlusCircle, Trash2 } from 'lucide-react';
import { NavItem } from '@/types/admin';
import { Skeleton } from '@/components/ui/skeleton';

const NavigationMenuPage = () => {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching navigation items:', error);
        toast.error('Failed to load navigation items.');
      } else {
        setNavItems(data || []);
      }
      setLoading(false);
    };

    fetchNavItems();
  }, []);

  const handleNavItemChange = (id: string, field: keyof NavItem, value: any) => {
    setNavItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSaveNavItem = async (item: NavItem) => {
    const { error } = await supabase
      .from('navigation_items')
      .update(item)
      .eq('id', item.id);

    if (error) {
      toast.error(`Failed to save navigation item: ${item.label}.`);
      console.error('Error saving navigation item:', error);
    } else {
      toast.success(`${item.label} navigation item saved successfully!`);
    }
  };

  const handleAddNavItem = async () => {
    const newNavItem: Omit<NavItem, 'id' | 'created_at' | 'updated_at'> = {
      label: 'New Item',
      path: '/',
      order: navItems.length > 0 ? Math.max(...navItems.map(item => item.order)) + 1 : 0,
      is_external: false,
      parent_id: null,
    };
    const { data, error } = await supabase
      .from('navigation_items')
      .insert(newNavItem)
      .select()
      .single();

    if (error) {
      toast.error('Failed to add new navigation item.');
      console.error('Error adding navigation item:', error);
    } else if (data) {
      setNavItems(prevItems => [...prevItems, data]);
      toast.success('New navigation item added!');
    }
  };

  const handleDeleteNavItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this navigation item?')) return;

    const { error } = await supabase
      .from('navigation_items')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete navigation item.');
      console.error('Error deleting navigation item:', error);
    } else {
      setNavItems(prevItems => prevItems.filter(item => item.id !== id));
      toast.success('Navigation item deleted!');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="capitalize text-primary-teal">Navigation Menu</CardTitle>
        <Button onClick={handleAddNavItem} size="sm">
          <PlusCircle size={16} className="mr-2" /> Add New Item
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {navItems.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-3 border rounded-md bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-grow w-full">
              <div className="space-y-1">
                <Label htmlFor={`nav-label-${item.id}`}>Label</Label>
                <Input
                  id={`nav-label-${item.id}`}
                  value={item.label}
                  onChange={(e) => handleNavItemChange(item.id, 'label', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`nav-path-${item.id}`}>Path/URL</Label>
                <Input
                  id={`nav-path-${item.id}`}
                  value={item.path}
                  onChange={(e) => handleNavItemChange(item.id, 'path', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`nav-order-${item.id}`}>Order</Label>
                <Input
                  id={`nav-order-${item.id}`}
                  type="number"
                  value={item.order}
                  onChange={(e) => handleNavItemChange(item.id, 'order', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="flex items-center space-x-2 mt-6 md:mt-0">
                <Switch
                  id={`nav-external-${item.id}`}
                  checked={item.is_external}
                  onCheckedChange={(checked) => handleNavItemChange(item.id, 'is_external', checked)}
                />
                <Label htmlFor={`nav-external-${item.id}`}>External Link</Label>
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0 w-full md:w-auto justify-end">
              <Button onClick={() => handleSaveNavItem(item)} size="sm">Save</Button>
              <Button variant="destructive" onClick={() => handleDeleteNavItem(item.id)} size="sm">
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NavigationMenuPage;