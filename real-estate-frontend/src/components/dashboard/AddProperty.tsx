'use client'

import { useState } from 'react'
import { mintProperty } from '@/utils/contractInteractions'
import { toast } from "@/hooks/use-toast"
import { uploadToPinata } from "@/utils/PinataService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ImagePlus, Loader2 } from 'lucide-react'

export default function AddProperty() {
  const [property, setProperty] = useState({
    name: '',
    location: '',
    description: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProperty(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image file.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      const hash = await uploadToPinata(selectedFile)

      await mintProperty(property.name, property.location, property.description, hash)
      toast({
        title: "Success",
        description: "Property added successfully",
      })
      setProperty({ name: '', location: '', description: '' })
      setSelectedFile(null)
      setPreviewUrl(null)
    } catch (error) {
      console.error('Error adding property:', error)
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New Property</CardTitle>
          <CardDescription className="text-gray-400">Fill in the details to add a new property to the marketplace.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Property Name</Label>
              <Input
                id="name"
                name="name"
                value={property.name}
                onChange={handleInputChange}
                required
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter property name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-300">Location</Label>
              <Input
                id="location"
                name="location"
                value={property.location}
                onChange={handleInputChange}
                required
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter property location"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={property.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Describe the property"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image" className="text-gray-300">Property Image</Label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-56 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors duration-300">
                  <div className="flex flex-col items-center justify-center pt-5 pb-4">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg max-h-56 max-w-full"
                      />
                    ) : (
                      <>
                        <ImagePlus className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG or GIF (MAX. 800x400px)</p>
                      </>
                    )}
                  </div>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-300"
            disabled={isUploading}
            onClick={handleSubmit}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Add Property'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

