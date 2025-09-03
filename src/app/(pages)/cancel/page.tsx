import Link from 'next/link';
import { XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CancelPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
        <Card className="w-full max-w-lg text-center p-6 sm:p-8 rounded-xl shadow-2xl">
            <CardHeader className="p-0">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                    <XCircle className="h-10 w-10 text-destructive" />
                </div>
                <div className="mt-4">
                    <CardTitle className="text-3xl font-headline">Payment Cancelled</CardTitle>
                    <CardDescription className="mt-2 text-lg">
                        Your payment was not processed.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="mt-6 p-0">
                <p className="text-muted-foreground">
                    Something went wrong, or you cancelled the transaction. Please try again.
                </p>
                <Button asChild size="lg" className="mt-8 w-full">
                    <Link href="/">
                        Try Again <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    </main>
  );
}
