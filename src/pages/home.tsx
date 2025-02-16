"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Media {
  _id: string;
  filename: string;
  url: string;
  type: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function HomePage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const HOST = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${HOST}/auth/userinfo`, {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error: any) {
        console.error("Error fetching user:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          setUser(null);
        }
      }
    };

    fetchUser();
  }, [navigate]);

  const fetchMedia = useCallback(async () => {
    try {
      if (!user?.id) return;
      const response = await axios.get(`${HOST}/media/${user.id}`, {
        withCredentials: true,
      });
      setMedia(response.data);
    } catch (error: any) {
      console.error("Fetching error:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch media. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [user, navigate, toast]);

  useEffect(() => {
    if (user) fetchMedia();
  }, [user, fetchMedia]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${HOST}/media/upload`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        title: "Upload successful",
        description: "Your media has been uploaded.",
      });

      fetchMedia();
      setFile(null);
      setIsUploadDialogOpen(false);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description:
          error.response?.data?.message ||
          "An error occurred while uploading. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Enable the button after upload is complete
    }
  };

  const handleDelete = async (mediaId: string) => {
    try {
      await axios.delete(`${HOST}/media/${mediaId}`, {
        withCredentials: true,
      });

      toast({
        title: "Delete successful",
        description: "Your media has been deleted.",
      });

      fetchMedia();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: "An error occurred while deleting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMediaClick = (item: Media) => {
    setSelectedMedia(item);
  };

  const filteredMedia = media
    .filter((item) => filterType === "all" || item.type === filterType)
    .filter((item) =>
      item.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto py-2 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Media</h1> */}
          <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
            <Dialog
              open={isUploadDialogOpen}
              onOpenChange={setIsUploadDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>Upload Media</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Media</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <Label htmlFor="file">File</Label>
                    <Input
                      id="file"
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Upload"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            {filteredMedia.length > 0 && (
              <div className="flex items-center space-x-4">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Search by filename"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs bg-white"
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMedia.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                onClick={() => handleMediaClick(item)}
              >
                {item.type === "image" ? (
                  <img
                    src={item.url || "/placeholder.svg"}
                    alt={item.filename}
                    className="w-full h-48 object-cover"
                  />
                ) : item.type === "video" ? (
                  <video src={item.url} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">Unsupported file type</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {item.filename}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <Badge
                      className="rounded-full"
                      variant={item.type === "image" ? "default" : "secondary"}
                    >
                      {item.type}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {format(new Date(item.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item._id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Dialog
        open={!!selectedMedia}
        onOpenChange={() => setSelectedMedia(null)}
      >
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{selectedMedia?.filename}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex justify-center items-center max-h-[calc(90vh-100px)]">
            {selectedMedia?.type === "image" ? (
              <img
                src={selectedMedia.url || "/placeholder.svg"}
                alt={selectedMedia.filename}
                className="max-w-full max-h-full object-contain"
              />
            ) : selectedMedia?.type === "video" ? (
              <video
                src={selectedMedia.url}
                controls
                className="max-w-full max-h-full"
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
